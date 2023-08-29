<template>
  <el-dialog
    class="tool-window"
    width="1000px"
    draggable
    :fullscreen="true"
    :show-close="false"
    :append-to-body="true"
  >
    <template #header>
      <header class="tool-window__header">
        <h2>{{title}}</h2>
      </header>
    </template>
    <slot></slot>
  </el-dialog>
</template>

<script>

export default {
  name: "ToolWindow",
  props: {
    title: {
      required: true
    }
  }
}
</script>

<style lang="scss">
.tool-window {
  border-radius: 10px !important;
  overflow: hidden !important;
  width: 1000px !important;
  height: 90% !important;
  top: 5%;
  display: flex;
  flex-direction: column;
  position: relative;
  .el-dialog__header {
    flex-shrink: 0;
    padding: 0;
    margin: 0;
    .tool-window__header {
      background: #eee;
      height: 30px;
      line-height: 30px;
      display: flex;
      justify-content: center;
      h2 {
        font-size: var(--font-size);
        font-weight: normal;
      }
    }
  }
  .el-dialog__body {
    padding: 0;
    margin: 0;
    flex-grow: 1;
    overflow: hidden;
  }
}
</style>
