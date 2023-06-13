<template>
  <v-layer
    ref="table"
    :config="layerConfig"
  >
    <v-rect ref="background" :config="config">
    </v-rect>
    <!-- 表头 -->
    <v-rect
      :config="tableHeaderConfig"
      @mouseover="handleHeaderMouseover"
      @mouseleave="handleHeaderMouseleave"
      @click="selectTable"
    />
    <!-- 表头文字 -->
    <v-text
      :config="tableNameConfig"
      @mouseover="handleHeaderMouseover"
      @mouseleave="handleHeaderMouseleave"
      @click="selectTable"
    />
    <v-rect
      v-for="(field,index) in table.fields"
      :key="field.name"
      :config="{
        y: index * fieldHeight + tableHeaderConfig.height,
        width,
        height: fieldHeight,
        fill: '#fff'
      }"
      @mousedown="handleFieldMouseDown(field)"
      @mouseup="handleFieldMouseUp(field)"
    />
    <v-text
      v-for="(field,index) in table.fields"
      :key="field"
      :config="{
        text: field.name,
        x: 10,
        y: index * fieldHeight + tableHeaderConfig.height + 8,
        fontSize: 15,
        fill: '#333'
      }"
      @mousedown="handleFieldMouseDown(field)"
      @mouseup="handleFieldMouseUp(field)"
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
    height: {
      default: 300
    },
    fieldHeight: {
      default: 30
    },
    table: {
      required: true
    },
    relations: {
      required: true
    },
    selected: {
      default: false
    }
  },
  data () {
    const _this = this
    return {
      layerConfig: {
        x: _this.x,
        y: _this.y,
        draggable: false,
      },
      config: {
        width: _this.width,
        height: _this.height,
        fill: '#fff',
        stroke: '#ccc',
        strokeWidth: 1,
      },
      tableHeaderConfig: {
        x: 1,
        y: 1,
        width: _this.width - 2,
        height: _this.fieldHeight - 2,
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
      return this.relations.find(r => r.endTable === this.table.name)
    }
  },
  watch: {
    selected (newValue) {
      if (newValue) {
        this.select()
        return
      }
      this.select(false)
    }
  },
  methods: {
    selectTable (e) {
      this.$emit('table:select', this.table.id)
    },
    // 选择/取消选择表
    select (selected=true) {
      const background = this.$refs.background.getNode()
      if (selected) {
        background.setAttr('stroke', '#3d6596')
        background.setAttr('strokeWidth', 5)
      } else {
        background.setAttr('stroke', '#ccc')
        background.setAttr('strokeWidth', 1)
      }
    },
    // 鼠标进入表头
    handleHeaderMouseover (e) {
      this.getNode().draggable(true)
      // 改变光标
      window.document.body.style.cursor = 'move'
    },
    // 鼠标离开表头
    handleHeaderMouseleave (e) {
      this.getNode().draggable(false)
      // 改变光标
      window.document.body.style.cursor = 'default'
    },
    getNode () {
      return this.$refs.table.getNode()
    },
    // 处理字段按下
    handleFieldMouseDown (field) {
      // 禁用表拖动
      this.getNode().draggable(false)
      this.$emit('field:mousedown', { table: this.table, field })
    },
    // 处理字段按下弹起
    handleFieldMouseUp (field) {
      // 开启表拖动
      this.getNode().draggable(true)
      this.$emit('field:mouseup', { table: this.table, field })
    }
  }
}
</script>

<style scoped>

</style>
