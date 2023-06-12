<template>
  <div class="database-query-models">
    <v-stage
      ref="stage"
      :config="configKonva"
      @mouseup="$refs.stage.getNode().draggable(true)"
    >
      <Table
        v-for="(table,index) in tables"
        :ref="table.name"
        :key="table.name"
        :width="200"
        :x="index * 220 + 50"
        :y="80"
        :table="table"
        :relations="relations"
        @dragmove="handleDragmove"
        @field:mousedown="handleFieldMouseDown"
        @field:mouseup="handleFieldMouseUp"
      />
      <v-layer>
        <RelationLine v-for="(line,index) in relationLines" :index="index" :end="line.end" :start="line.start"/>
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
import Table from "../../../components/database/query-model/Table.vue";
import RelationLine from "../../../components/database/query-model/RelationLine.vue";

export default {
  name: "database-query-models",
  components: {RelationLine, Table},
  data () {
    return {
      configKonva: {
        // 设计区宽度
        width: 1960,
        // 设计区高度
        height: 1000,
        draggable: true
      },
      tables: [
        {
          x: 50,
          y: 80,
          width: 200,
          name: 'user',
          fields: ['id', 'name', 'create_time']
        },
        {
          x: 270,
          y: 80,
          width: 200,
          name: 'order',
          fields: ['id', 'user_id', 'create_time']
        }
      ],
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
    handleDragmove () {
      for (const table of this.tables) {
        const position = this.$refs[table.name][0].getNode().getAbsolutePosition()
        table.x = position.x
        table.y = position.y
      }
      this.computeRelationLines()
    },
    computeRelationLines () {
      this.relationLines = []
      for (const relation of this.relations) {
        const startTable = this.tables.find(t => t.name === relation.startTable)
        const endTable = this.tables.find(t => t.name === relation.endTable)
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
    // 处理字段按下弹起
    handleFieldMouseUp ({ table, field }) {
      // 开启stage拖动，用于恢复整体拖动
      const stageNode = this.$refs.stage.getNode()
      stageNode.draggable(true)
      this.relationRuntime.endTable = table
      this.relationRuntime.endField = field
      // 添加关联
      let relation = this.relations.find(
        r => r.startTable === this.relationRuntime.startTable.name &&
        r.endTable === this.relationRuntime.endTable.name
      )
      if (relation == null) {
        relation = {
          startTable: this.relationRuntime.startTable.name,
          endTable: this.relationRuntime.endTable.name,
          joinType: 'INNER JOIN',
          fields: {}
        }
        this.relations.push(relation)
      }
      relation.fields[this.relationRuntime.startField] = this.relationRuntime.endField
      this.computeRelationLines()
    },
    __getFieldPosition (table, field, withWidth=true) {
      const stageNode = this.$refs.stage.getNode()
      const stagePosition = stageNode.getAbsolutePosition()
      const fieldIndex = table.fields.findIndex(f => f === field)
      const y = table.y + 30 + (fieldIndex + 1) * 30 - 15 - stagePosition.y
      const x = table.x + (withWidth ? table.width : 0) - stagePosition.x
      return { x, y }
    }
  },
  mounted () {
    this.computeRelationLines()
  }
}
</script>

<style scoped lang="scss">
.database-query-models {
  height: 100%;
}
</style>
