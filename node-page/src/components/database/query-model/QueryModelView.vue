<template>
  <div class="database-query-models">
    <div v-if="currentDatabase == null || currentDatabase === ''" class="no-datasource-tip">
      <div class="tip-wrap">
        <h4>请先选择一个数据源</h4>
        <DataSourceSelect :model-value="currentDatabase" :with-block="true"/>
      </div>
    </div>
    <div v-else-if="connectError != null" class="connect-error-tip">
      <div class="tip-wrap">
        <h4>数据源连接失败</h4>
        <p>{{connectError}}</p>
        <el-button @click="this.$refs.operaDataSourceWindow.open(this.currentDataSource)">修改数据源信息</el-button>
      </div>
    </div>
    <template v-else>
      <TableLibrary
        :query-models="queryModels"
        :tables="tables"
        @table:drag="handleDragStart"
        v-model:current-model="currentModel"
      />
      <div class="designer-wrap">
        <div v-if="currentModel != null" class="toolbar">
          <!-- 线条类型 -->
          <ul class="line-types">
            <li :class="{selected: currentModel.lineType === 'join'}" @click="currentModel.lineType = 'join'">
              <em class="join-line"></em>
              <label>{{$t('database.joinLine')}}</label>
            </li>
            <li :class="{selected: currentModel.lineType === 'aggregate'}" @click="currentModel.lineType = 'aggregate'">
              <em class="aggregate-line"></em>
              <label>{{$t('database.aggregateLine')}}</label>
            </li>
          </ul>
        </div>
        <!-- 设计器 -->
        <QueryModelDesigner
          v-if="currentModel != null"
          ref="designer"
          :model="currentModel"
          :field-height="30"
          @change="saveModel"
        />
        <!-- 表设置 -->
        <TableSetting
          :table="currentTable"
          :joins="joins"
          :aggregates="aggregates"
          @field:change="handleSettingChange"
        />
      </div>
    </template>
    <OperaDataSourceWindow ref="operaDataSourceWindow" @success="fetchDatabases"/>
  </div>
</template>

<script>

import QueryModelDesigner from "./Designer.vue";
import TableSetting from "./TableSetting.vue";
import TableLibrary from "./TableLibrary.vue";
import RelationLine from "./RelationLine.vue";
import Table from "./Table.vue";
import {mapState} from "vuex";
import {search, updateModel} from "../../../api/database";
import {fetchTables} from "../../../api/database.util";
import DataSourceSelect from "../DataSourceSelect.vue";
import OperaDataSourceWindow from "../OperaDataSourceWindow.vue";

export default {
  name: "QueryModelView",
  components: {
    OperaDataSourceWindow,
    DataSourceSelect,
    TableLibrary,
    QueryModelDesigner, TableSetting, RelationLine, Table},
  data () {
    return {
      // 字段高度
      fieldHeight: 30,
      // 查询模型
      queryModels: [],
      // 数据库
      databases: [],
      // 表集合
      tables: [],
      // 关联线类型
      lineType: 'join',
      // 当前选中的数据源
      currentDataSource: null,
      // 当前选中的数据源连接失败消息
      connectError: null,
      // 当前选中的模型
      currentModel: null,
    }
  },
  computed: {
    ...mapState(['currentProject', 'currentDatabase']),
    // 当前表
    currentTable () {
      if (this.currentModel == null || this.currentModel.previewTableId == null) {
        return null
      }
      return this.currentModel.tables.find(t => t.id === this.currentModel.previewTableId)
    },
    // 当前模型joins
    joins () {
      if (this.currentTable == null) {
        return []
      }
      return this.currentModel.joins
    },
    // 当前模型的聚合信息
    aggregates () {
      if (this.currentTable == null || this.currentTable.type !== 'MAIN') {
        return []
      }
      return this.currentModel.aggregates
    }
  },
  watch: {
    currentDatabase () {
      this.fetchDatabases()
    }
  },
  methods: {
    // 保存查询模型
    saveModel () {
      const modelSettings = this.__getModelSettings(this.currentModel)
      updateModel ({
        database: this.currentDatabase,
        model: modelSettings
      })
        .then(() => {
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 表设置更改
    handleSettingChange () {
      this.saveModel()
      this.$refs.designer.render()
    },
    // 开始拖动表放置在设计器中
    handleDragStart (tableName) {
      this.currentModel.dragData = this.tables.find(t => t.name === tableName)
    },
    // 查询库
    fetchDatabases () {
      this.currentModel = null
      this.$nextTick(() => {
        search ()
          .then(data => {
            this.databases = data
            this.fetchTables()
          })
          .catch(e => {
            this.$tip.apiFailed(e)
          })
      })
    },
    // 查询数据库表
    fetchTables () {
      this.currentDataSource = this.databases.find(db => db.id === this.currentDatabase)
      if (this.currentDataSource == null) {
        return
      }
      fetchTables ({
        host: this.currentDataSource.host,
        port: this.currentDataSource.port,
        user: this.currentDataSource.username,
        password: this.currentDataSource.password,
        database: this.currentDataSource.schema
      })
        .then(tables => {
          this.connectError = null
          this.tables = tables.map(t => {
            return {
              ...t,
              alias: t.name,
              fields: t.fields.map(f => {
                return {
                  ...f,
                  isVirtual: false
                }
              })
            }
          })
          // 查询模型
          this.fetchModels()
        })
        .catch(e => {
          this.connectError = e.message
        })
    },
    // 查询模型
    fetchModels () {
      const database = this.databases.find(db => db.id === this.currentDatabase)
      const models = database.models
      this.queryModels = models.map(model => {
        model.tables = model.tables.map(table => {
          const dbTable = this.tables.find(tb => tb.name.toLowerCase() === table.name.toLowerCase())
          // 如果表不存在 && 不是虚拟表，则返回null（表已被删除）
          if (dbTable == null && !table.isVirtual) {
            return null
          }
          // 获取字段信息
          let fields = table.fields
          if (dbTable != null) {
            fields = fields.map(f => {
              const dbField = dbTable.fields.find(dbField => dbField.name === f.name)
              return this.__modelField2field(f, dbField)
            })
            // 过滤掉已删除的字段（为null的字段）
            fields = fields.filter(f => f != null)
          }
          return {
            ...table,
            fields,
            // 添加joins，用于存放join关系
            // joins: []
          }
        })
        // 过滤掉不存在的表
        model.tables = model.tables.filter(t => t != null)
        // // 如果模型中不存在表，则返回null
        // if (model.tables.length === 0) {
        //   return model
        // }
        // join处理
        model.joins.map(join => {
          return this.__modelJoin2join(model, join)
        })
        model.joins = model.joins.filter(join => join != null)
        // 聚合函数处理
        model.aggregates.map(agg => {
          return this.__modelAggregate2Aggregate(model, agg)
        })
        model.aggregates = model.aggregates.filter(agg => agg != null)
        return model
      })
      if (this.queryModels.length > 0) {
        this.currentModel = this.queryModels[0]
      }
      // 过滤掉无效的模型（不存在表的模型）
      // this.queryModels = this.queryModels.filter(m => m != null)
    },
    // 获取模型设置
    __getModelSettings (currentModel) {
      // 相关表信息
      const tables = currentModel.tables.map(item => {
        return {
          id: item.id,
          name: item.name,
          alias: item.alias,
          comment: item.comment,
          isVirtual: item.isVirtual,
          type: item.type,
          fields: item.fields.map(f => {
            const obj = {}
            for (const key in f) {
              if (key === 'table' || key.startsWith('__')) {
                continue
              }
              obj[key] = f[key]
            }
            return obj
          }),
          x: item.x,
          y: item.y
        }
      })
      // 关联关系信息
      const joins = currentModel.joins.map(item => {
        return {
          ...item,
          table: item.table.id,
          targetTable:item.targetTable.id,
          ons: item.ons.map(on => {
            return {
              field: on.field.name,
              targetField: on.targetField.name,
              relation: on.relation
            }
          })
        }
      })
      // 聚合关系信息
      const aggregates = currentModel.aggregates.map(agg => {
        return {
          table: agg.table.id,
          targetTable: agg.targetTable.id,
          field: agg.field.name,
          targetField: agg.targetField.name,
          function: agg.function
        }
      })
      return {
        id: currentModel.id,
        name: currentModel.name,
        comment: currentModel.comment,
        // 关联表信息
        tables,
        // join关系
        joins,
        // 聚合关系
        aggregates
      }
    },
    // 模型字段转字段详情, modelField: 查询模型中的字段信息，dbField: 数据库字段信息
    __modelField2field (modelField, dbField) {
      // 没有模型字段，但有表字段（新增的表字段或未展示的字段）
      if (dbField != null && modelField == null) {
        return {
          ...dbField,
          visible: false,
          alias: dbField.name,
          isVirtual: false
        }
      }
      // 没有对应的数据库表字段，说明字段已删除
      if (dbField == null && !modelField.isVirtual) {
        return null
      }
      // 整合模型字段和表字段信息
      return {
        ...modelField,
        alias: modelField.alias,
        isVirtual: modelField.isVirtual,
        type: modelField.isVirtual ? modelField.type : dbField.type,
        comment: modelField.isVirtual ? modelField.comment : dbField.comment,
        visible: modelField.visible == null ? true : modelField.visible
      }
    },
    // 模型join转join详情
    __modelJoin2join (model, modelJoin) {
      const table = model.tables.find(t => t.id === modelJoin.table)
      const targetTable = model.tables.find(t => t.id === modelJoin.targetTable)
      if (table == null || targetTable == null) {
        return null
      }
      modelJoin.table = table
      modelJoin.targetTable = targetTable
      const ons = []
      for (const on of modelJoin.ons) {
        const field = table.fields.find(f => f.name.toLowerCase() === on.field.toLowerCase())
        const targetField = targetTable.fields.find(f => f.name.toLowerCase() === on.targetField.toLowerCase())
        if (field == null || targetField == null) {
          continue
        }
        ons.push({
          field,
          targetField,
          relation: on.relation
        })
      }
      if (ons.length === 0) {
        return null
      }
      modelJoin.ons = ons
      return modelJoin
    },
    // 模型join转join详情
    __modelAggregate2Aggregate (model, modelAggregate) {
      // 查询表信息
      const table = model.tables.find(t => t.id === modelAggregate.table)
      const targetTable = model.tables.find(t => t.id === modelAggregate.targetTable)
      if (table == null || targetTable == null) {
        return null
      }
      modelAggregate.table = table
      modelAggregate.targetTable = targetTable
      // 查询字段信息
      const field = table.fields.find(f => f.name.toLowerCase() === modelAggregate.field.toLowerCase())
      const targetField = targetTable.fields.find(f => f.name.toLowerCase() === modelAggregate.targetField.toLowerCase())
      if (field == null || targetField == null) {
        return null
      }
      modelAggregate.field = field
      modelAggregate.targetField = targetField
      return modelAggregate
    }
  },
  created () {
    this.fetchDatabases()
  }
}
</script>

<style scoped lang="scss">
.database-query-models {
  height: 100%;
  display: flex;
  position: relative;
  background: var(--background-color);
  border-top: 5px solid;
  border-image: var(--border-colors);
  // 未选择数据源提醒 & 数据源连接失败
  .no-datasource-tip, .connect-error-tip {
    width: 100%;
    padding-top: 100px;
    &.connect-error-tip {
      p {
        color: var(--color-danger);
      }
    }
    .tip-wrap {
      width: 500px;
      margin: 0 auto;
      background: var(--color-light);
      padding: 50px;
      box-shadow: var(--page-shadow);
      h4 {
        margin-bottom: 10px;
      }
    }
  }
  .table-library {
    width: 255px;
    flex-shrink: 0;
  }
  .designer-wrap {
    flex-grow: 1;
    position: relative;
    background: var(--primary-color);
    overflow: hidden;
    .toolbar {
      display: flex;
      align-items: center;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 62px;
      background: #333;
      padding: 0 20px;
      box-sizing: border-box;
      box-shadow: 0 1px 10px rgba(0, 0, 0, .5);
      z-index: 100;
      .line-types {
        display: flex;
        li {
          width: 120px;
          height: 50px;
          background: var(--background-color);
          margin-right: 10px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-radius: 10px;
          &.selected {
            background: var(--primary-color-match-1);
            label {
              color: var(--font-color);
              font-weight: bold;
            }
          }
          label {
            margin-top: 5px;
            font-size: var(--font-size-mini);
            color: var(--color-gray);
          }
          &:last-of-type {
            margin-right: 0;
          }
        }
        .join-line, .aggregate-line {
          display: block;
          width: 50px;
          height: 3px;
          background: #ccc;
          border: 5px solid var(--primary-color);
          box-sizing: content-box;
        }
        .aggregate-line {
          background: var(--primary-color-match-1);
        }
      }
      .opera {
        display: flex;
        align-items: center;
        &::before {
          content: '|';
          margin: 0 30px;
          color: #ccc;
        }
      }
    }
  }
}
</style>