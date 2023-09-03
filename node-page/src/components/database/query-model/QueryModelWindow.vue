<template>
  <el-dialog
    custom-class="query-model-window"
    title="查询模型设计"
    v-model="visible"
    fullscreen
    append-to-body
  >
    <QueryModelView/>
  </el-dialog>
</template>

<script>

import QueryModelView from "./QueryModelView.vue";

export default {
  name: "QueryModelWindow",
  components: {QueryModelView},
  data () {
    return {
      visible: false
    }
  },
  methods: {
    open () {
      this.visible = true
    }
  }
}
</script>

<style lang="scss">
.query-model-window {
  min-width: 1000px;
  display: flex;
  flex-direction: column;
  //width: 98% !important;
  //height: 98% !important;
  //top: 1%;

  .el-dialog__header {
    background: var(--background-color);
    margin-right: 0;
  }

  .el-dialog__body {
    padding: 0;
    flex-grow: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
}
</style>
