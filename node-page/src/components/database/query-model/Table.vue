<template>
  <v-layer :config="layerConfig">
    <v-rect :config="config">
    </v-rect>
    <!-- 表头 -->
    <v-rect :config="{ ...config, height: 30,fill: '#3d6596'}"/>
    <!-- 表头文字 -->
    <v-text :config="tableNameConfig"/>
    <v-rect :config="{ ...config, y: 80, height: 30,fill: '#f2f2f2'}"/>
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
    }
  },
  data () {
    return {
      layerConfig: {
        x: this.x,
        y: this.y,
        draggable: true
      },
      config: {
        x: 0,
        y: 0,
        width: 200,
        height: 300,
        fill: '#eee'
      },
      tableNameConfig: {
        text: 'user',
        x: 10,
        y: 5,
        fontSize: 20,
        fill: '#fff'
      }
    }
  }
}
</script>

<style scoped>

</style>
