<template>
  <v-layer
    ref="table"
    :config="layerConfig"
  >
    <v-rect :config="config">
    </v-rect>
    <!-- 关联关系 -->
    <v-text
      v-if="relation != null"
      :config="{ ...tableNameConfig, text: relation.joinType, color: '#333333', y: 20 }"
    />
    <!-- 表头 -->
    <v-rect
      :config="tableHeaderConfig"
      @mouseover="handleMouseover"
      @mouseleave="handleMouseleave"
    />
    <!-- 表头文字 -->
    <v-text :config="tableNameConfig"/>
    <v-rect
      v-for="(field,index) in table.fields"
      :key="field"
      :config="{
        y: index * fieldHeight + tableHeaderConfig.height,
        width,
        height: 30,
        fill: '#fff'
      }"
      @mousedown="handleFieldMouseDown(field)"
      @mouseup="handleFieldMouseUp(field)"
    />
    <v-text
      v-for="(field,index) in table.fields"
      :key="field"
      :config="{
        text: field,
        x: 10,
        y: index * fieldHeight + tableHeaderConfig.height + 8,
        fontSize: 15,
        fill: '#333'
      }"
    />
  </v-layer>
</template>

<script>
export default {
  name: "Table",
  props: {
    x: {
      default: 0
    },
    y: {
      default: 0
    },
    width: {
      default: 200
    },
    fieldHeight: {
      default: 30
    },
    table: {
      required: true
    },
    relations: {
      required: true
    }
  },
  data () {
    const _this = this
    return {
      layerConfig: {
        x: _this.x,
        y: _this.y,
        draggable: false
      },
      config: {
        width: _this.width,
        height: 300,
        fill: '#fff',
        // 阴影
        shadowBlur: 1
      },
      tableHeaderConfig: {
        width: _this.width,
        height: _this.fieldHeight,
        fill: '#3d6596'
      }
    }
  },
  computed: {
    tableNameConfig () {
      return {
        text: this.table.name,
        x: 10,
        y: 8,
        fontSize: 15,
        fill: '#fff'
      }
    },
    relation () {
      console.log(this.table.name)
      console.log(this.relations.map(item => item.endTable))
      return this.relations.find(r => r.endTable === this.table.name)
    }
  },
  methods: {
    handleMouseover (e) {
      const tableNode = this.$refs.table.getNode()
      tableNode.draggable(true)
      const node = e.target
      // 改变颜色
      node.setAttr('fill', 'red')
      // 改变光标
      window.document.body.style.cursor = 'move'
    },
    handleMouseleave (e) {
      const tableNode = this.$refs.table.getNode()
      tableNode.draggable(false)
      const node = e.target
      // 改变颜色
      node.setAttr('fill', '#3d6596')
      // 改变光标
      window.document.body.style.cursor = 'default'
    },
    getNode () {
      return this.$refs.table.getNode()
    },
    // 处理字段按下
    handleFieldMouseDown (field) {
      // 禁用表拖动
      const tableNode = this.$refs.table.getNode()
      tableNode.draggable(false)
      this.$emit('field:mousedown', { table: this.table, field })
    },
    // 处理字段按下弹起
    handleFieldMouseUp (field) {
      // 开启表拖动
      const tableNode = this.$refs.table.getNode()
      tableNode.draggable(true)
      this.$emit('field:mouseup', { table: this.table, field })
    }
  }
}
</script>

<style scoped>

</style>
