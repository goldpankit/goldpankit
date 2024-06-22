<template>
  <div class="database-query-models">
    <div v-if="currentDatabase == null || currentDatabase === ''" class="no-datasource-tip">
      <div class="tip-wrap">
        <h4>请先选择一个数据库</h4>
        <DataSourceSelect :model-value="currentDatabase" :with-block="true"/>
      </div>
    </div>
    <div v-else-if="connectError != null" class="connect-error-tip">
      <div class="tip-wrap">
        <h4>数据库连接失败</h4>
        <p>{{connectError}}</p>
        <el-button @click="this.$refs.operaDataSourceWindow.open(currentProject, this.currentDatabaseDetail)">修改数据库信息</el-button>
      </div>
    </div>
    <template v-else>
      <TableLibrary
        :query-models="queryModels"
        :tables="tables"
        :tables-loading="loading.tables"
        @table:drag="handleDragStart"
        v-model:current-model="currentModel"
        @tables:refresh="fetchTables(false)"
        @deleted="handleModelDeleted"
      />
      <div class="designer-wrap">
<!--        <div v-if="currentModel != null" class="toolbar">-->
<!--          &lt;!&ndash; 线条类型 &ndash;&gt;-->
<!--          <ul class="line-types">-->
<!--            <li :class="{selected: currentModel.lineType === 'join'}" @click="currentModel.lineType = 'join'">-->
<!--              <em class="join-line"></em>-->
<!--              <label>{{$t('database.joinLine')}}</label>-->
<!--            </li>-->
<!--            <li :class="{selected: currentModel.lineType === 'aggregate'}" @click="currentModel.lineType = 'aggregate'">-->
<!--              <em class="aggregate-line"></em>-->
<!--              <label>{{$t('database.aggregateLine')}}</label>-->
<!--            </li>-->
<!--          </ul>-->
<!--        </div>-->
        <!-- 设计器 -->
<!--        <QueryModelDesigner-->
<!--          v-if="currentModel != null"-->
<!--          ref="designer"-->
<!--          :model="currentModel"-->
<!--          :field-height="30"-->
<!--          @change="saveModel"-->
<!--        />-->
        <DesignerV2 :model="currentModel"/>
        <!-- 表设置 -->
        <TableSetting
          :table="currentTable"
          :joins="joins"
          :aggregates="aggregates"
          @field:change="handleSettingChange"
        />
        <div v-if="queryModels.length === 0" class="no-model-tip">
          <div class="tip-wrap">
            <h4>{{$t('database.queryModelEmptyTipTitle')}}</h4>
            <p>{{$t('database.queryModelEmptyTip')}}</p>
          </div>
        </div>
      </div>
    </template>
    <OperaDataSourceWindow ref="operaDataSourceWindow" @success="fetchTables"/>
  </div>
</template>

<script>
import QueryModelDesigner from "./Designer.vue";
import TableSetting from "./TableSetting.vue";
import TableLibrary from "./TableLibrary.vue";
import RelationLine from "./RelationLine.vue";
import Table from "./Table.vue";
import {mapState} from "vuex";
import DataSourceSelect from '../DataSourceSelect'
import OperaDataSourceWindow from '../OperaDataSourceWindow'
import { fetchAll, updateById } from '@/api/project.database.model'
import { fetchDatabases } from '@/api/project.database'
import { fetchTables } from '@/api/database.util'
import DesignerV2 from "@/components/database/query-model/DesignerV2.vue";

export default {
  name: 'QueryModelView',
  components: {
    DesignerV2,
    OperaDataSourceWindow,
    DataSourceSelect,
    TableLibrary,
    QueryModelDesigner,
    TableSetting,
    RelationLine,
    Table
  },
  props: {
    databaseId: {
      required: true
    }
  },
  data () {
    return {
      loading: {
        tables: false
      },
      // 字段高度
      fieldHeight: 30,
      // 查询模型
      queryModels: [],
      // 表集合
      tables: [],
      // 关联线类型
      lineType: 'join',
      // 当前选中的数据库连接失败消息
      connectError: null,
      // 当前选中的模型
      currentModel: null
    }
  },
  computed: {
    ...mapState(['globalLoading', 'databases', 'currentProject', 'currentDatabase', 'currentDatabaseDetail']),
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
    // 监听数据库加载完成动作，加载完成后查询数据库模型
    'globalLoading.databases': {
      immediate: true,
      handler (newValue) {
        if (!newValue) {
          this.fetchTables()
        }
      }
    },
    currentDatabase () {
      this.fetchTables()
    }
  },
  methods: {
    // 处理模型删除
    handleModelDeleted (model) {
      if (this.currentModel === model) {
        if (this.queryModels.length > 0) {
          this.currentModel = this.queryModels[0]
        }
      }
      if (this.queryModels.length === 0) {
        this.currentModel = null
      }
    },
    // 保存查询模型
    saveModel () {
      const modelSettings = this.__getModelSettings(this.currentModel)
      updateById ({
        projectId: this.currentProject,
        databaseId: this.currentDatabase,
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
    // 查询数据库表
    fetchTables (withModels = true) {
      // 此处不可直接使用currentDatabaseDetail，因为在进入页面时，currentDatabaseDetail可能还为被赋值
      const targetDatabase = this.databases.find(d => d.id === this.currentDatabase)
      if (targetDatabase == null) {
        return
      }
      this.loading.tables = true
      fetchTables ({
        host: targetDatabase.host,
        port: targetDatabase.port,
        user: targetDatabase.username,
        password: targetDatabase.password,
        database: targetDatabase.schema
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
          if (withModels) {
            this.fetchModels()
          }
        })
        .catch(e => {
          this.connectError = e.message
        })
        .finally(() => {
          this.loading.tables = false
        })
    },
    // 查询模型
    fetchModels () {
      const database = this.databases.find(db => db.id === this.currentDatabase)
      const models = database.models
      const deletedTables = []
      this.queryModels = models.map(model => {
        model.tables = model.tables.map(table => {
          const dbTable = this.tables.find(tb => tb.name.toLowerCase() === table.name.toLowerCase())
          // 如果表不存在 && 不是虚拟表，则返回null（表已被删除）
          if (dbTable == null && !table.isVirtual) {
            deletedTables.push(table)
            return table
          }
          // 同步字段信息
          let fields = table.fields
          if (dbTable != null) {
            fields = dbTable.fields
            // 同步模型字段信息
            fields = fields.map(dbField => {
              const modelField = table.fields.find(mf => mf.name === dbField.name)
              return this.__modelField2field(modelField, dbField)
            })
            // 过滤掉已删除的字段（为null的字段）
            fields = fields.filter(f => f != null)
          }
          return {
            ...table,
            fields
          }
        })
        // 删除了主表
        if (deletedTables.find(t => t.type === 'MAIN') != null) {
          model.tables = []
          model.joins = []
          model.aggregates = []
        }
        // 子表不存在
        else {
          for (const table of deletedTables) {
            // 删除join关系
            model.joins = model.joins.filter(join => {
              if (join.table === table.id) {
                return false
              }
              if (join.targetTable === table.id) {
                return false
              }
              return true
            })
            // 删除聚合关系
            model.aggregates = model.aggregates.filter(agg => {
              if (agg.table === table.id) {
                return false
              }
              if (agg.targetTable === table.id) {
                return false
              }
              return true
            })
            // 删除表
            const index = model.tables.findIndex(t => t.id === table.id)
            if (index !== -1) {
              model.tables.splice(index, 1)
            }
          }
        }
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
      // 默认选择第一个
      if (this.queryModels.length > 0) {
        this.currentModel = this.queryModels[0]
      }
      // 没有模型，则清空模型选择
      else {
        this.currentModel = null
      }
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
          visible: true,
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
  // 未选择数据库提醒 & 数据库连接失败
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
      .el-button {
        margin-top: 10px;
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
      background: var(--primary-color-light);
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
    .no-model-tip {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .tip-wrap {
        width: 500px;
        color: var(--color-light);
        display: flex;
        flex-direction: column;
        align-items: center;
        h4 {
          font-size: var(--font-size-large);
          margin-bottom: 30px;
        }
      }
    }
  }
}
</style>
