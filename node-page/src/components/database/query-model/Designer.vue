<template>
  <!-- 提醒和创建虚拟表 -->
  <div
    v-if="model.tables.length === 0"
    class="empty-tip"
    @dragover.prevent
    @drop="handleDrop"
  >
    <div class="wrap">
      <p>Drag and drop the table on the left here or fill out the form below to create a virtual table.</p>
<!--      <el-table :data="virtualTable.fields">-->
<!--        <el-table-column prop="name" label="*Name">-->
<!--          <template #default="{ row }">-->
<!--            <el-input v-model="row.name"/>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="type" label="*Type">-->
<!--          <template #default="{ row }">-->
<!--            <el-input v-model="row.type"/>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="comment" label="*Comment">-->
<!--          <template #default="{ row }">-->
<!--            <el-input v-model="row.comment"/>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--      </el-table>-->
<!--      <div class="opera">-->
<!--        <el-button type="important" @click="confirmCreateVirtualTable">Confirm Create</el-button>-->
<!--      </div>-->
    </div>
  </div>
  <div class="stage-wrap" tabindex="-1" @keyup.delete="handleDelete">
    <v-stage
      v-if="rendered"
      ref="stage"
      :config="configKonva"
      @mouseup="$refs.stage.getNode().draggable(true)"
      @click="globalClick"
    >
      <Table
        v-for="table in model.tables"
        :ref="table.id"
        :key="table.name"
        :field-height="fieldHeight"
        :x="table.x"
        :y="table.y"
        :table="table"
        :relations="model.joins"
        :selected="model.selectedTableId === table.id"
        @dragmove="moveTable"
        @field:mousedown="handleFieldMouseDown"
        @field:mouseup="handleFieldMouseUp"
        @table:select="handleTableSelect"
      />
      <v-layer>
        <RelationLine
          v-for="line in relationLines"
          :key="line.id"
          :line-type="line.type"
          :start="line.start"
          :end="line.end"
          :selected="model.selectedLineId === line.id"
          @select="model.selectedLineId = line.id"
          @unselect="model.selectedLineId = null"
        />
      </v-layer>
    </v-stage>
  </div>
</template>

<script>

import RelationLine from "./RelationLine.vue";
import Table from "./Table.vue";

export default {
  name: "QueryModelDesigner",
  components: {Table, RelationLine},
  props: {
    model: {},
    fieldHeight: {
      default: 30
    }
  },
  data () {
    return {
      rendered: true,
      configKonva: {
        // 设计区宽度
        width: 1260,
        // 设计区高度
        height: 1000,
        draggable: true
      },
      relationLines: [],
      // 拖动关联时的数据
      relationRuntime: {
        table: null,
        field: null,
        targetTable: null,
        targetField: null
      },
      // 虚拟表数据
      virtualTable: {
        name: 'test',
        alias: 'test',
        comment: '',
        fields: [
          { name: 'regisCount', type: 'int', comment: '注册数' }
        ]
      }
    }
  },
  computed: {
    tableLength () {
      return this.model.tables.length
    }
  },
  watch: {
    tableLength () {
      this.$emit('change')
      this.render()
    },
    model () {
      this.render()
    }
  },
  methods: {
    // 处理删除
    handleDelete () {
      // 删除线
      if (this.model.selectedLineId != null) {
        this.__deleteLine()
        return
      }
      // 删除表
      if (this.model.selectedTableId != null) {
        this.__deleteTable()
      }
    },
    // 全局点击
    globalClick (e) {
      // 如果点击的是空白部分，则清空选择
      if (e.target.nodeType === 'Stage') {
        this.model.selectedTableId = null
        this.model.selectedLineId = null
      }
    },
    // 移动表
    moveTable () {
      for (const table of this.model.tables) {
        const position = this.$refs[table.id][0].getNode().getAbsolutePosition()
        table.x = position.x
        table.y = position.y
      }
      this.computeRelations()
    },
    // 计算关联线
    computeRelations () {
      this.relationLines = []
      // 计算join关系线
      for (const join of this.model.joins) {
        for (const on of join.ons) {
          const startPosition = this.__getFieldPosition(join.table, on.field)
          const endPosition = this.__getFieldPosition(join.targetTable, on.targetField, false)
          if (startPosition == null || endPosition == null) {
            continue
          }
          this.relationLines.push({
            id: Math.random(),
            start: startPosition,
            end: endPosition,
            type: 'join',
            table: join.table,
            field: on.field,
            targetTable: join.targetTable,
            targetField: on.targetField
          })
        }
      }
      // 计算聚合关系线
      for (const aggregate of this.model.aggregates) {
        const startPosition = this.__getFieldPosition(aggregate.table, aggregate.field)
        const endPosition = this.__getFieldPosition(aggregate.targetTable, aggregate.targetField, false)
        if (startPosition == null || endPosition == null) {
          continue
        }
        this.relationLines.push({
          id: Math.random(),
          start: startPosition,
          end: endPosition,
          type: 'aggregate',
          table: aggregate.table,
          field: aggregate.field,
          targetTable: aggregate.targetTable,
          targetField: aggregate.targetField
        })
      }
    },
    // 处理字段按下
    handleFieldMouseDown ({ table, field }) {
      // 禁用stage拖动，用于实现字段拖动关联
      const stageNode = this.$refs.stage.getNode()
      stageNode.draggable(false)
      this.relationRuntime.table = table
      this.relationRuntime.field = field
    },
    // 处理字段按下弹起（添加字段关联）
    handleFieldMouseUp ({ table, field }) {
      // 开启stage拖动，用于恢复整体拖动
      const stageNode = this.$refs.stage.getNode()
      stageNode.draggable(true)
      // 记录结束表个字段
      this.relationRuntime.targetTable = table
      this.relationRuntime.targetField = field
      // 如果开始表和结束表是同一个，则不做关联操作
      if (this.relationRuntime.table.id === this.relationRuntime.targetTable.id) {
        return
      }
      // 添加关联
      if (this.model.lineType === 'join') {
        this.__addJoinRelation()
        this.$emit('change')
        return
      }
      // 如果为聚合函数关联
      if (this.model.lineType === 'aggregate') {
        this.__addAggregate()
        this.$emit('change')
      }
    },
    // 处理表格选中
    handleTableSelect (tableId) {
      this.model.selectedTableId = tableId
    },
    // stage拖拽放下
    handleDrop (e) {
      const stage = this.$refs.stage.getNode()
      stage.setPointersPositions(e);
      const position = stage.getPointerPosition()
      const size = {
        width: 200,
        height: (this.model.dragData.fields.length + 1) * this.fieldHeight
      }
      const newTable = {
        ...this.model.dragData,
        // 字段
        fields: this.model.dragData.fields.map(f => {
          return {
            ...f,
            alias: f.name,
            visible: true,
            isVirtual: false
          }
        }),
        // 非虚拟表
        isVirtual: false,
        // 第一个表标记为主表
        type: this.model.tables.length === 0 ? 'MAIN' : 'SUB',
        x: position.x - size.width / 2,
        y: position.y - size.height / 2,
        // 增加设计器元素ID
        id: '' + Math.random(),
        // 添加joins，用于存放join关系
        joins: []
      }
      this.model.tables.push(newTable)
      // 重新渲染，使新添加的元素绘制在stage中
      this.render()
      this.$emit('change')
    },
    // 添加虚拟表
    confirmCreateVirtualTable () {
      const size = {
        width: 200,
        height: (this.virtualTable.fields.length + 1) * this.fieldHeight
      }
      const newTable = {
        ...this.virtualTable,
        ...size,
        // 虚拟表
        isVirtual: true,
        // 第一个表标记为主表
        type: this.model.tables.length === 0 ? 'MAIN' : 'SUB',
        x: 100,
        y: 100,
        // 增加设计器元素ID
        id: '' + Math.random(),
        // 添加joins，用于存放join关系
        joins: []
      }
      this.model.tables.push(newTable)
      // 重新渲染，使新添加的元素绘制在stage中
      this.render()
      this.$emit('change')
    },
    // 渲染
    render () {
      this.rendered = false
      this.$nextTick(() => {
        this.rendered = true
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
            this.handleDrop(e)
          })
          this.computeRelations()
        })
      })
    },
    // 删除线
    __deleteLine () {
      // 查找线条信息
      const line = this.relationLines.find(line => line.id === this.model.selectedLineId)
      // 删除join线
      if (line.type === 'join') {
        // 查找对应join
        const join = this.model.joins.find(join => {
          return join.table.id === line.table.id && join.targetTable.id === line.targetTable.id
        })
        // 找到对应的on
        const onIndex = join.ons.findIndex(on => {
          return on.field.name === line.field.name && on.targetField.name === line.targetField.name
        })
        if (onIndex !== -1) {
          join.ons.splice(onIndex, 1)
        }
      }
      // 删除聚合线
      else {
        // 查询聚合
        const aggIndex = this.model.aggregates.findIndex(agg => agg.table.id === line.table.id && agg.targetTable.id === line.targetTable.id)
        this.model.aggregates.splice(aggIndex, 1)
      }
      this.model.selectedLineId = null
      this.$emit('change')
      this.render()
    },
    // 删除表
    __deleteTable () {
      // 删除join关系
      this.model.joins = this.model.joins.filter(join => {
        if (join.table.id === this.model.selectedTableId) {
          return false
        }
        if (join.targetTable.id === this.model.selectedTableId) {
          return false
        }
        return true
      })
      // 删除table
      this.model.tables = this.model.tables.filter(table => table.id !== this.model.selectedTableId)
    },
    // 添加join关系
    __addJoinRelation () {
      // 如果开始表和结束表是同一个，则不做关联操作
      if (this.relationRuntime.table.id === this.relationRuntime.targetTable.id) {
        return
      }
      // 添加关联
      let join = this.model.joins.find(
        r => r.table.id === this.relationRuntime.table.id &&
          r.targetTable.id === this.relationRuntime.targetTable.id
      )
      if (join == null) {
        join = {
          table: this.relationRuntime.table,
          targetTable: this.relationRuntime.targetTable,
          joinType: 'INNER JOIN',
          relation: 'ONE-TO-ONE',
          ons: []
        }
        this.model.joins.push(join)
      }
      join.ons.push({
        field: this.relationRuntime.field,
        targetField: this.relationRuntime.targetField,
        relation: 'AND'
      })
      this.computeRelations()
    },
    // 添加聚合关系
    __addAggregate () {
      // 如果开始表和结束表是同一个，则不做关联操作
      if (this.relationRuntime.table.id === this.relationRuntime.targetTable.id) {
        return
      }
      // 添加聚合
      let aggregate = this.model.aggregates.find(
        r => r.table.id === this.relationRuntime.table.id &&
          r.targetTable.id === this.relationRuntime.targetTable.id
      )
      if (aggregate == null) {
        aggregate = {
          table: this.relationRuntime.table,
          targetTable: this.relationRuntime.targetTable,
          field: this.relationRuntime.field,
          targetField: this.relationRuntime.targetField,
          function: 'COUNT'
        }
        this.model.aggregates.push(aggregate)
      }
      this.computeRelations()
    },
    // 获取字段坐标
    __getFieldPosition (table, field, withWidth=true) {
      const stageNode = this.$refs.stage.getNode()
      const stagePosition = stageNode.getAbsolutePosition()
      let fieldIndex = table.fields.findIndex(f => f.visible && f.name === field.name)
      if (fieldIndex === -1) {
        return null
      }
      let staticFieldIndex = fieldIndex
      // 计算出前面隐藏的字段，每隐藏一个，坐标-1，最终才是字段真正展示的坐标
      for (let i = 0; i < staticFieldIndex; i++) {
        if (!table.fields[i].visible) {
          fieldIndex--
        }
      }
      if (fieldIndex === -1) {
        return null
      }
      const x = table.x + (withWidth ? 200 : 0) - stagePosition.x
      const y = table.y + this.fieldHeight + (fieldIndex + 1) * this.fieldHeight - 15 - stagePosition.y
      return { x, y }
    }
  },
  mounted () {
    this.render()
  }
}
</script>

<style scoped lang="scss">
.empty-tip {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  .wrap {
    width: 500px;
    padding: 20px;
    box-sizing: border-box;
    p {
      font-size: var(--font-size-middle);
      text-align: center;
      line-height: 25px;
    }
    .el-table {
      margin-top: 20px;
    }
    .opera {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
  }
}
.stage-wrap {
  &:focus {
    outline: none;
  }
}
</style>
