<template>
  <v-layer
    ref="table"
    :config="layerConfig"
  >
    <v-rect :config="config">
    </v-rect>
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
    }
  },
  data () {
    const _this = this
    return {
      layerConfig: {
        x: _this.x,
        y: _this.y,
        draggable: true
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
    handleDragmove (e) {
      // this.$emit('dragmove')
    },
    getNode () {
      return this.$refs.table.getNode()
    }
  }
}
</script>

<style scoped>

</style>
