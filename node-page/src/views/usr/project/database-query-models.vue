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
            v-for="table in tableList"
            :key="table.name"
            :name="table.name"
            draggable="true"
            @dragstart="handleDragStart"
          >{{table.name}}</li>
        </ul>
      </div>
    </div>
    <div class="designer-wrap">
      <v-stage
        v-if="reloaded"
        ref="stage"
        :config="configKonva"
        @mouseup="$refs.stage.getNode().draggable(true)"
        @click="globalClick"
      >
        <Table
          v-for="table in tables"
          :ref="table.id"
          :key="table.name"
          :width="table.width"
          :height="table.height"
          :field-height="fieldHeight"
          :x="table.x"
          :y="table.y"
          :table="table"
          :relations="relations"
          :selected="selectData.table === table.id"
          @dragmove="moveTable"
          @field:mousedown="handleFieldMouseDown"
          @field:mouseup="handleFieldMouseUp"
          @table:select="handleTableSelect"
        />
        <v-layer>
          <RelationLine v-for="(line,index) in relationLines" :end="line.end" :start="line.start"/>
        </v-layer>
      </v-stage>
    </div>
    <div class="setting" :class="{ show: currentTable != null }">
      <h4>Table Setting</h4>
      <el-form v-if="currentTable != null">
        <el-form-item label="Alias">
          <el-input/>
        </el-form-item>
        <el-form-item label="Join Type">
          <el-select>
            <el-option value="INNER JOIN">INNER JOIN</el-option>
            <el-option value="LEFT JOIN">LEFT JOIN</el-option>
            <el-option value="RIGHT JOIN">RIGHT JOIN</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Query Fields">
          <el-table :data="currentTable.fields">
            <el-table-column label="Name" width="150px" prop="name" fixed></el-table-column>
            <el-table-column label="Comment" width="150px" prop="comment"></el-table-column>
            <el-table-column label="Type" width="100px" prop="type"></el-table-column>
            <el-table-column label="length" width="80px" prop="length"></el-table-column>
            <el-table-column label="Decimal" width="90px" prop="decimal"></el-table-column>
            <el-table-column label="Default Value" width="125px" prop="defaultValue"></el-table-column>
            <el-table-column label="Required" width="100px" prop="required"></el-table-column>
            <el-table-column label="Primary Key" width="125px" prop="isPrimaryKey"></el-table-column>
            <el-table-column label="Auto Increment" width="145px" prop="isAutoIncrement"></el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Table from "../../../components/database/query-model/Table.vue";
import RelationLine from "../../../components/database/query-model/RelationLine.vue";
import {fetchTables} from "../../../api/db";
import {mapState} from "vuex";

export default {
  components: {RelationLine, Table},
  data () {
    return {
      reloaded: true,
      fieldHeight: 30,
      configKonva: {
        // 设计区宽度
        width: 1260,
        // 设计区高度
        height: 1000,
        draggable: true
      },
      tableList: [],
      tables: [],
      relations: [
        // {
        //   startTable: 'user',
        //   endTable: 'order',
        //   joinType: 'INNER JOIN',
        //   fields: {
        //     id: 'user_id',
        //     create_time: 'create_time'
        //   }
        // }
      ],
      relationLines: [],
      // 选择数据
      selectData: {
        table: null
      },
      // 拖送数据
      dragData: {
        source: null
      },
      // 拖动关联时的数据
      relationRuntime: {
        startTable: null,
        startField: null,
        endTable: null,
        endField: null
      }
    }
  },
  computed: {
    ...mapState(['currentProject', 'currentDatabase']),
    currentTable () {
      if (this.selectData.table == null) {
        return null
      }
      return this.tables.find(t => t.id === this.selectData.table)
    }
  },
  methods: {
    // 全局点击
    globalClick (e) {
      // 如果点击的是空白部分，则清空选择
      if (e.target.nodeType === 'Stage') {
        this.selectData.table = null
      }
    },
    // 移动表
    moveTable () {
      for (const table of this.tables) {
        const position = this.$refs[table.id][0].getNode().getAbsolutePosition()
        table.x = position.x
        table.y = position.y
      }
      this.computeRelationLines()
    },
    // 计算关联线
    computeRelationLines () {
      this.relationLines = []
      for (const relation of this.relations) {
        const startTable = this.tables.find(t => t.id === relation.startTable)
        const endTable = this.tables.find(t => t.id === relation.endTable)
        for (const startField in relation.fields) {
          const endField = relation.fields[startField]
          const startPosition = this.__getFieldPosition(startTable, startField)
          const endPosition = this.__getFieldPosition(endTable, endField, false)
          this.relationLines.push({
            start: startPosition,
            end: endPosition
          })
        }
      }
    },
    // 处理字段按下
    handleFieldMouseDown ({ table, field }) {
      // 禁用stage拖动，用于实现字段拖动关联
      const stageNode = this.$refs.stage.getNode()
      stageNode.draggable(false)
      this.relationRuntime.startTable = table
      this.relationRuntime.startField = field
    },
    // 处理字段按下弹起（添加字段关联）
    handleFieldMouseUp ({ table, field }) {
      // 开启stage拖动，用于恢复整体拖动
      const stageNode = this.$refs.stage.getNode()
      stageNode.draggable(true)
      // 记录结束表个字段
      this.relationRuntime.endTable = table
      this.relationRuntime.endField = field
      // 如果开始表和结束表是同一个，则不做关联操作
      if (this.relationRuntime.startTable.id === this.relationRuntime.endTable.id) {
        return
      }
      // 添加关联
      let relation = this.relations.find(
        r => r.startTable === this.relationRuntime.startTable.id &&
        r.endTable === this.relationRuntime.endTable.id
      )
      if (relation == null) {
        relation = {
          startTable: this.relationRuntime.startTable.id,
          endTable: this.relationRuntime.endTable.id,
          joinType: 'INNER JOIN',
          fields: {}
        }
        this.relations.push(relation)
      }
      relation.fields[this.relationRuntime.startField.name] = this.relationRuntime.endField.name
      this.computeRelationLines()
    },
    // 处理表格选中
    handleTableSelect (tableId) {
      this.selectData.table = tableId
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
          this.tableList = tables.map(t => {
            return {
              ...t,
              id: '' + Math.random()
            }
          })
        })
        .catch(e => {
          console.log('e', e)
        })
    },
    // 开始拖动
    handleDragStart (e) {
      this.dragData.source = e.target.getAttribute('name')
    },
    // stage拖拽放下
    __handleStageDrop (stage) {
      const position = stage.getPointerPosition()
      const target = this.tableList.find(table => table.name === this.dragData.source)
      const size = {
        width: 200,
        height: (target.fields.length + 1) * this.fieldHeight
      }
      const newTable = {
        ...target,
        ...size,
        x: position.x - size.width / 2,
        y: position.y - size.height / 2,
        id: '' + Math.random()
      }
      this.tables.push(newTable)
      // 重新渲染，使新添加的元素绘制在stage中
      this.__render()
    },
    __getFieldPosition (table, field, withWidth=true) {
      const stageNode = this.$refs.stage.getNode()
      const stagePosition = stageNode.getAbsolutePosition()
      const fieldIndex = table.fields.findIndex(f => f.name === field)
      const y = table.y + this.fieldHeight + (fieldIndex + 1) * this.fieldHeight - 15 - stagePosition.y
      const x = table.x + (withWidth ? table.width : 0) - stagePosition.x
      return { x, y }
    },
    // 渲染
    __render () {
      this.reloaded = false
      this.$nextTick(() => {
        this.reloaded = true
        this.$nextTick(() => {
          // 采用DOM方式为stage绑定拖拽放下事件
          const stage = this.$refs.stage.getNode()
          const container = stage.container()
          container.addEventListener('dragover', function (e) {
            e.preventDefault(); // !important
          });
          // 放下时增加表
          container.addEventListener('drop', (e) => {
            e.preventDefault();
            stage.setPointersPositions(e);
            this.__handleStageDrop(stage)
          })
        })
      })
    }
  },
  created () {
    this.fetchTables()
  },
  mounted () {
    this.computeRelationLines()
    this.__render()
  }
}
</script>

<style scoped lang="scss">
.database-query-models {
  height: 100%;
  display: flex;
  background: #eee;
  position: relative;
  .table-wrap {
    flex-shrink: 0;
    width: 220px;
    box-sizing: border-box;
    border-right: 1px solid #ccc;
    display: flex;
    flex-direction: column;
    .block {
      border-top: 1px solid #ccc;
      padding: 20px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      h4 {
        flex-shrink: 0;
        margin-bottom: 10px;
      }
      ul {
        flex-grow: 1;
        overflow-y: auto;
        li {
          padding: 5px 0;
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
  }
  .setting {
    position: absolute;
    background: #fff;
    padding: 30px;
    top: 0;
    right: 0;
    height: 100%;
    width: 800px;
    flex-shrink: 0;
    overflow-y: auto;
    box-shadow: -2px 0 10px #ccc;
    transform: translateX(2000px);
    transition: all ease .3s;
    &.show {
      transform: translateX(0);
    }
  }
}
</style>
