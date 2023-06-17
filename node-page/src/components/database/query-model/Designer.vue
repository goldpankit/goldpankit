<template>
  <v-stage
    v-if="rendered"
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
      :relations="joins"
      :selected="selectedTableId === table.id"
      @dragmove="moveTable"
      @field:mousedown="handleFieldMouseDown"
      @field:mouseup="handleFieldMouseUp"
      @table:select="handleTableSelect"
    />
    <v-layer>
      <RelationLine
        v-for="line in relationLines"
        :line-type="line.type"
        :start="line.start"
        :end="line.end"
      />
    </v-layer>
  </v-stage>
</template>

<script>

import RelationLine from "./RelationLine.vue";
import Table from "./Table.vue";

export default {
  name: "QueryModelDesigner",
  components: {Table, RelationLine},
  props: {
    // 已选中的表ID
    selectedTableId: {},
    // 关系线类型
    lineType: {
      default: 'join'
    },
    // 设计器中的表
    tables: {
      type: Array
    },
    // joins
    joins: {
      type: Array,
      required: true
    },
    // 聚合关系
    aggregates: {
      type: Array
    },
    // 拖动数据（外部执行拖动时的数据信息）
    dragData: {}
  },
  data () {
    return {
      rendered: true,
      fieldHeight: 30,
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
        startTable: null,
        startField: null,
        endTable: null,
        endField: null
      }
    }
  },
  methods: {
    // 全局点击
    globalClick (e) {
      // 如果点击的是空白部分，则清空选择
      if (e.target.nodeType === 'Stage') {
        this.$emit('update:selectedTableId', null)
      }
    },
    // 移动表
    moveTable () {
      for (const table of this.tables) {
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
      for (const join of this.joins) {
        for (const on of join.ons) {
          const startPosition = this.__getFieldPosition(join.table, on.startField)
          const endPosition = this.__getFieldPosition(join.joinTable, on.endField, false)
          this.relationLines.push({
            start: startPosition,
            end: endPosition,
            type: 'join'
          })
        }
      }
      // 计算聚合关系线
      for (const aggregate of this.aggregates) {
        const startPosition = this.__getFieldPosition(aggregate.table, aggregate.field)
        const endPosition = this.__getFieldPosition(aggregate.targetTable, aggregate.targetField, false)
        this.relationLines.push({
          start: startPosition,
          end: endPosition,
          type: 'aggregate'
        })
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
      if (this.lineType === 'join') {
        this.__addJoinRelation()
        return
      }
      // 如果为聚合函数关联
      if (this.lineType === 'aggregate') {
        this.__addAggregate()
      }
    },
    // 处理表格选中
    handleTableSelect (tableId) {
      this.$emit('update:selectedTableId', tableId)
    },
    // 添加join关系
    __addJoinRelation () {
      // 如果开始表和结束表是同一个，则不做关联操作
      if (this.relationRuntime.startTable.id === this.relationRuntime.endTable.id) {
        return
      }
      // 添加关联
      let join = this.joins.find(
        r => r.table.id === this.relationRuntime.startTable.id &&
          r.joinTable.id === this.relationRuntime.endTable.id
      )
      if (join == null) {
        join = {
          table: this.relationRuntime.startTable,
          joinTable: this.relationRuntime.endTable,
          joinType: 'INNER JOIN',
          relation: 'ONE-TO-ONE',
          ons: []
        }
        this.joins.push(join)
      }
      join.ons.push({
        startField: this.relationRuntime.startField,
        endField: this.relationRuntime.endField,
        relationType: 'AND'
      })
      this.computeRelations()
    },
    // 添加聚合关系
    __addAggregate () {
      // 如果开始表和结束表是同一个，则不做关联操作
      if (this.relationRuntime.startTable.id === this.relationRuntime.endTable.id) {
        return
      }
      // 添加聚合
      let aggregate = this.aggregates.find(
        r => r.table.id === this.relationRuntime.startTable.id &&
          r.targetTable.id === this.relationRuntime.endTable.id
      )
      if (aggregate == null) {
        aggregate = {
          table: this.relationRuntime.startTable,
          targetTable: this.relationRuntime.endTable,
          field: this.relationRuntime.startField,
          targetField: this.relationRuntime.endField,
          function: 'COUNT'
        }
        this.aggregates.push(aggregate)
      }
      this.computeRelations()
    },
    // stage拖拽放下
    __handleStageDrop (stage) {
      const position = stage.getPointerPosition()
      const size = {
        width: 200,
        height: (this.dragData.fields.length + 1) * this.fieldHeight
      }
      const newTable = {
        ...this.dragData,
        ...size,
        // 第一个表标记为主表
        type: this.tables.length === 0 ? 'MAIN' : 'SUB',
        x: position.x - size.width / 2,
        y: position.y - size.height / 2,
        // 增加设计器元素ID
        id: '' + Math.random(),
        // 添加joins，用于存放join关系
        joins: [],
        // 添加是否展示子字段
        visible: true
      }
      this.tables.push(newTable)
      // 重新渲染，使新添加的元素绘制在stage中
      this.__render()
    },
    // 获取字段坐标
    __getFieldPosition (table, field, withWidth=true) {
      const stageNode = this.$refs.stage.getNode()
      const stagePosition = stageNode.getAbsolutePosition()
      const fieldIndex = table.fields.findIndex(f => f.name === field.name)
      const y = table.y + this.fieldHeight + (fieldIndex + 1) * this.fieldHeight - 15 - stagePosition.y
      const x = table.x + (withWidth ? table.width : 0) - stagePosition.x
      return { x, y }
    },
    // 渲染
    __render () {
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
            stage.setPointersPositions(e);
            this.__handleStageDrop(stage)
          })
        })
      })
    }
  },
  mounted () {
    this.__render()
  }
}
</script>

<style scoped>

</style>
