<template>
  <div class="database-query-models">
    <div class="table-wrap">
      <div class="block">
        <h4>Query Models</h4>
        <ul>
          <li>user</li>
          <li>order</li>
        </ul>
      </div>
      <div class="block">
        <h4>Tables</h4>
        <ul>
          <li
            v-for="table in tables"
            :key="table.name"
            :name="table.name"
            draggable="true"
            @dragstart="handleDragStart"
          >{{table.name}}</li>
        </ul>
      </div>
    </div>
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
        v-model:selected-table-id="designer.selectedTableId"
        :line-type="lineType"
        :tables="designer.tables"
        :aggregates="designer.aggregates"
        :joins="designer.joins"
        :drag-data="designer.dragData"
      />
    </div>
    <!-- 表设置 -->
    <TableSetting
      :table="currentTable"
      :table-joins="currentTableJoins"
    />
  </div>
</template>

<script>
import {mapState} from "vuex";
import Table from "../../../components/database/query-model/Table.vue";
import RelationLine from "../../../components/database/query-model/RelationLine.vue";
import TableSetting from "../../../components/database/query-model/TableSetting.vue";
import QueryModelDesigner from "../../../components/database/query-model/Designer.vue";
import {fetchTables} from "../../../api/db";

export default {
  components: {QueryModelDesigner, TableSetting, RelationLine, Table},
  data () {
    return {
      // 表集合
      tables: [],
      // 关联线类型
      lineType: 'join',
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
      if (this.designer.selectedTableId == null) {
        return null
      }
      return this.designer.tables.find(t => t.id === this.designer.selectedTableId)
    },
    // 当前表joins
    currentTableJoins () {
      if (this.currentTable == null || this.currentTable.type !== 'MAIN') {
        return []
      }
      return this.designer.joins.filter(r => r.table.id === this.currentTable.id || r.joinTable.id === this.currentTable.id)
    }
  },
  methods: {
    // 开始拖动表放置在设计器中
    handleDragStart (e) {
      this.designer.dragData = this.tables.find(t => t.name === e.target.getAttribute('name'))
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
  .table-wrap {
    flex-shrink: 0;
    width: 255px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .block {
      border-top: 1px solid #ccc;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding: 20px 0;
      h4 {
        flex-shrink: 0;
        margin-bottom: 10px;
        padding: 0 20px;
      }
      ul {
        flex-grow: 1;
        overflow-y: auto;
        li {
          padding: 5px 20px;
        }
      }
      &:first-of-type {
        flex-grow: 0;
        flex-shrink: 0;
        height: 300px;
        border-top: 0;
      }
    }
  }
  .designer-wrap {
    flex-grow: 1;
    position: relative;
    background: #333;
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
      }
      .aggregate-line {
        background: #436b47;
      }
    }
  }
}
</style>
