<template>
  <div v-loading="globalLoading.models || loading.page" class="database-query-models">
    <div v-if="currentDatabase == null || currentDatabase === ''" class="no-datasource-tip">
      <div class="tip-wrap">
        <h4>请先选择一个数据库</h4>
        <DataSourceSelect :model-value="currentDatabase" :with-block="true"/>
      </div>
    </div>
    <div v-else-if="currentDatabaseConnect.error != null && !globalLoading.models && !loading.page" class="connect-error-tip">
      <div class="tip-wrap">
        <h4>数据库连接失败</h4>
        <p>{{currentDatabaseConnect.error}}</p>
        <el-button @click="$refs.operaDataSourceWindow.open(currentProject, getCurrentDatabaseDetail())">修改数据库信息</el-button>
      </div>
    </div>
    <template v-else-if="!globalLoading.models && !loading.page">
      <TableLibrary
        @table:drag="handleDragStart"
        v-model:current-model="currentModel"
        @deleted="handleModelDeleted"
      />
      <div class="designer-wrap">
<!--        <div v-if="currentModel != null" class="toolbar">-->
<!--          &lt;!&ndash; 线条类型 &ndash;&gt;-->
<!--          <ul class="line-types">-->
<!--            <li :class="{selected: currentModel.lineType === 'join'}" @click="currentModel.__lineType = 'join'">-->
<!--              <em class="join-line"></em>-->
<!--              <label>{{$t('database.joinLine')}}</label>-->
<!--            </li>-->
<!--            <li :class="{selected: currentModel.lineType === 'aggregate'}" @click="currentModel.__lineType = 'aggregate'">-->
<!--              <em class="aggregate-line"></em>-->
<!--              <label>{{$t('database.aggregateLine')}}</label>-->
<!--            </li>-->
<!--          </ul>-->
<!--        </div>-->
        <!-- 设计器 -->
        <DesignerV2
          :model="currentModel"
          :drag-table="dragTable"
          @change="saveModel"
          @model:created="handleDesignerCreatedModel"
        />
        <div v-if="models.length === 0" class="no-model-tip">
          <div class="tip-wrap">
            <h4>{{$t('database.queryModelEmptyTipTitle')}}</h4>
            <p>{{$t('database.queryModelEmptyTip')}}</p>
          </div>
        </div>
      </div>
    </template>
    <!-- 用于发起修改数据库信息窗口 -->
    <OperaDataSourceWindow ref="operaDataSourceWindow"/>
  </div>
</template>

<script>
import {mapState, mapGetters, mapActions, mapMutations} from 'vuex'
import QueryModelDesigner from "./Designer.vue";
import TableSetting from "./TableSetting.vue";
import TableLibrary from "./TableLibrary.vue";
import RelationLine from "./RelationLine.vue";
import Table from "./Table.vue";
import DataSourceSelect from '../DataSourceSelect'
import OperaDataSourceWindow from '../OperaDataSourceWindow'
import { updateById } from '@/api/project.database.model'
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
        page: true,
        tables: false
      },
      // 字段高度
      fieldHeight: 30,
      // 当前选中的数据库连接失败消息
      connectError: null,
      // 当前拖拽的表
      dragTable: null,
      // 当前选中的模型
      currentModel: null
    }
  },
  computed: {
    ...mapState(['globalLoading', 'databases', 'tables', 'models', 'currentProject', 'currentDatabase', 'currentDatabaseConnect'])
  },
  watch: {
    // 模型加载完成后，默认选中第一个模型
    'globalLoading.models': {
      immediate: true,
      handler () {
        if (this.models.length > 0) {
          this.currentModel = this.models[0]
        } else {
          this.currentModel = null
        }
      }
    }
  },
  methods: {
    ...mapMutations(['clearConnectError']),
    ...mapActions(['fetchTables']),
    ...mapGetters(['getCurrentDatabaseDetail']),
    // 处理设计器中因未选择模型自动创建的模型
    handleDesignerCreatedModel (newModel) {
      this.currentModel = newModel
      this.saveModel()
    },
    // 处理模型删除
    handleModelDeleted (model) {
      if (this.currentModel === model) {
        if (this.models.length > 0) {
          this.currentModel = this.models[0]
        }
      }
      if (this.models.length === 0) {
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
    // 开始拖动表放置在设计器中
    handleDragStart (tableName) {
      // if (this.currentModel == null) {
      //   return
      // }
      // this.currentModel.dragData = this.tables.find(t => t.name === tableName)
      this.dragTable = this.tables.find(t => t.name === tableName)
    },
    // 获取模型设置
    __getModelSettings (currentModel) {
      // 相关表信息
      const tables = currentModel.tables.map(item => {
        return {
          id: item.id,
          name: item.name,
          alias: item.alias,
          type: item.type,
          fields: item.fields.map(f => {
            return {
              name: f.name,
              alias: f.alias,
              // 对于字段是否展示，只有不展示时才添加visible，
              visible: f.visible ? undefined : f.visible
            }
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
          targetTable: item.targetTable.id,
          ons: item.ons.map(on => {
            return {
              table: on.table.id,
              targetTable: on.targetTable.id,
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
    }
  },
  created () {
    /*
    延迟300毫秒是为了优化页面加载体验，避免从数据库连接失败页面=>返回到桌面页=>进入一个成功连接的查询模型页时出现闪屏
    因为连接错误页面会在currentDatabaseConnect.error不为null时展示，当从一个连接失败的页面进入到一个连接成功的页面时，currentDatabaseConnect.error值并没有被清空，
    所以会率先展示连接失败页，然后再进入loading效果，引起失败页面闪现的问题
    */
    setTimeout(() => {
      this.loading.page = false
    }, 300)
  }
}
</script>

<style scoped lang="scss">
$--menu-width: 300px;
.database-query-models {
  height: 100%;
  display: flex;
  position: relative;
  // background: var(--background-color);
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
    width: $--menu-width;
    flex-shrink: 0;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 9;
    background-color: #fff;
    border-right: 1px solid #eee;
  }
  .designer-wrap {
    flex-grow: 1;
    position: relative;
    background: #fff;
    overflow: hidden;
    .toolbar {
      position: fixed;
      top: 75px;
      left: $--menu-width + 20;
      display: flex;
      align-items: center;
      width: 300px;
      height: 62px;
      padding: 0 20px;
      box-sizing: border-box;
      z-index: 100;
      .line-types {
        display: flex;
        li {
          width: 120px;
          height: 35px;
          box-shadow: 0 1px 10px rgba(0, 0, 0, .2);
          background: var(--background-color);
          margin-right: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 10px;
          transition: all ease .15s;
          border: 2px solid transparent;
          &.selected {
            border-color: var(--primary-color-light);
            label {
              color: var(--font-color);
            }
          }
          label {
            margin-left: 5px;
            font-size: var(--font-size-mini);
            color: var(--color-gray);
          }
          &:last-of-type {
            margin-right: 0;
          }
        }
        .join-line, .aggregate-line {
          flex-shrink: 0;
          display: block;
          width: 20px;
          height: 20px;
          background: #999;
          border-radius: 50%;
        }
        .aggregate-line {
          background: #3e74ea;
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
