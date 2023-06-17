<template>
  <div class="database-query-models">
    <TableLibrary
      :query-models="queryModels"
      :tables="tables"
      @table:drag="handleDragStart"
      v-model:current-model="currentModel"
    />
    <div class="designer-wrap">
      <!-- 线条类型 -->
      <ul class="line-types">
        <li :class="{selected: lineType === 'join'}" @click="lineType = 'join'">
          <em class="join-line"></em>
          <label>Join Line</label>
        </li>
        <li :class="{selected: lineType === 'aggregate'}" @click="lineType = 'aggregate'">
          <em class="aggregate-line"></em>
          <label>Aggregate Line</label>
        </li>
      </ul>
      <!-- 设计器 -->
      <QueryModelDesigner
        v-if="currentModel != null"
        v-model:selected-table-id="currentModel.selectedTableId"
        :line-type="lineType"
        :tables="currentModel.tables"
        :aggregates="currentModel.aggregates"
        :joins="currentModel.joins"
        :drag-data="currentModel.dragData"
      />
    </div>
    <!-- 表设置 -->
    <TableSetting
      :table="currentTable"
      :table-joins="currentTableJoins"
      :aggregates="currentTableAggregates"
    />
  </div>
</template>

<script>
import {mapState} from "vuex";
import Table from "../../../components/database/query-model/Table.vue";
import RelationLine from "../../../components/database/query-model/RelationLine.vue";
import TableSetting from "../../../components/database/query-model/TableSetting.vue";
import QueryModelDesigner from "../../../components/database/query-model/Designer.vue";
import TableLibrary from "../../../components/database/query-model/TableLibrary.vue";
import {fetchTables} from "../../../api/db";

export default {
  components: {
    TableLibrary,
    QueryModelDesigner, TableSetting, RelationLine, Table},
  data () {
    return {
      // 查询模型
      queryModels: [],
      // 表集合
      tables: [],
      // 关联线类型
      lineType: 'join',
      // 当前选中的模型
      currentModel: null,
      // 设计器数据
      designer: {
        // 表
        tables: [],
        // 关联关系
        joins: [],
        // 聚合关系
        aggregates: [],
        // 当前选中的表
        selectedTableId: null,
        // 拖动数据
        dragData: null
      }
    }
  },
  computed: {
    ...mapState(['currentProject', 'currentDatabase']),
    currentTable () {
      if (this.currentModel == null || this.currentModel.selectedTableId == null) {
        return null
      }
      return this.currentModel.tables.find(t => t.id === this.currentModel.selectedTableId)
    },
    // 当前表joins
    currentTableJoins () {
      if (this.currentTable == null || this.currentTable.type !== 'MAIN') {
        return []
      }
      return this.currentModel.joins.filter(r => r.table.id === this.currentTable.id || r.joinTable.id === this.currentTable.id)
    },
    // 当前表的聚合函数列
    currentTableAggregates () {
      if (this.currentTable == null || this.currentTable.type !== 'MAIN') {
        return []
      }
      return this.currentModel.aggregates.filter(agg => agg.table.id === this.currentTable.id)
    }
  },
  methods: {
    // 开始拖动表放置在设计器中
    handleDragStart (tableName) {
      this.currentModel.dragData = this.tables.find(t => t.name === tableName)
    },
    // 查询数据库表
    fetchTables () {
      const database = this.currentProject.databases.find(db => db.name === this.currentDatabase)
      fetchTables ({
        host: database.host,
        port: database.port,
        user: database.username,
        password: database.password,
        database: database.schema
      })
        .then(tables => {
          this.tables = tables.map(t => {
            return {
              ...t,
              alias: t.name
            }
          })
        })
        .catch(e => {
          console.log('e', e)
        })
    },
  },
  created () {
    this.fetchTables()
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
  border-image: linear-gradient(to right, var(--primary-color), var(--primary-color-match-2), var(--primary-color-match-1)) 1;
  .table-library {
    width: 255px;
    flex-shrink: 0;
  }
  .designer-wrap {
    flex-grow: 1;
    position: relative;
    background: var(--primary-color);
    .line-types {
      display: flex;
      position: absolute;
      top: 20px;
      left: 20px;
      z-index: 100;
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
          background: #fff;
          label {
            color: var(--primary-color-match-2);
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
  }
}
</style>
