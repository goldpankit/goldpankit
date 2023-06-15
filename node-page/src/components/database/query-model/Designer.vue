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
      :relations="relations"
      :selected="selectedTableId === table.id"
      @dragmove="moveTable"
      @field:mousedown="handleFieldMouseDown"
      @field:mouseup="handleFieldMouseUp"
      @table:select="handleTableSelect"
    />
    <v-layer>
      <RelationLine v-for="line in relationLines" :end="line.end" :start="line.start"/>
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
    // 设计器中的表
    tables: {
      type: Array
    },
    // 关系
    relations: {
      type: Array,
      required: true
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
      this.computeRelationLines()
    },
    // 计算关联线
    computeRelationLines () {
      this.relationLines = []
      for (const relation of this.relations) {
        const startTable = this.tables.find(t => t.id === relation.startTable.id)
        const endTable = this.tables.find(t => t.id === relation.endTable.id)
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
        r => r.startTable.id === this.relationRuntime.startTable.id &&
          r.endTable.id === this.relationRuntime.endTable.id
      )
      if (relation == null) {
        relation = {
          startTable: this.relationRuntime.startTable,
          endTable: this.relationRuntime.endTable,
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
      this.$emit('update:selectedTableId', tableId)
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
        id: '' + Math.random()
      }
      this.tables.push(newTable)
      // 重新渲染，使新添加的元素绘制在stage中
      this.__render()
    },
    // 获取字段坐标
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
