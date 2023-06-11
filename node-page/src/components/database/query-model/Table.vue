<template>
  <v-layer :config="layerConfig">
    <v-rect :config="config">
    </v-rect>
    <!-- 表头 -->
    <v-rect :config="tableHeaderConfig"/>
    <!-- 表头文字 -->
    <v-text :config="tableNameConfig"/>
    <v-rect
      v-for="(field,index) in table.fields"
      :key="field"
      :config="{
        y: index * 30 + tableHeaderConfig.height,
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
        y: index * 30 + tableHeaderConfig.height + 8,
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
        height: 30,
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
  }
}
</script>

<style scoped>

</style>
