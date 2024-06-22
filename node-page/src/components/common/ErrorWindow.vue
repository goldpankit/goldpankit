<template>
  <el-dialog
    :title="title"
    v-model="visible"
    class="error-window"
    width="550px"
    append-to-body
  >
    <pre class="error-message">{{ message }}</pre>
  </el-dialog>
</template>

<script>

export default {
  name: 'ErrorWindow',
  data () {
    return {
      visible: false,
      title: '错误',
      message: ''
    }
  },
  methods: {
    open ({ title, message}) {
      this.title = title
      this.message = message
      this.visible = true
    }
  }
}
</script>

<style lang="scss">
.el-dialog.error-window {
  background-color: var(--color-danger);
  padding: 0;
  .el-dialog__header {
    padding: var(--el-dialog-padding-primary);
    .el-dialog__headerbtn {
      top: 5px;
    }
    .el-dialog__title {
      color: #fff;
    }
    .el-dialog__close {
      color: #fff;
    }
  }
  .el-dialog__body {
    background-color: #fff;
    padding: var(--el-dialog-padding-primary);
    border-top: 1px solid var(--primary-color-match-2-transition);
  }
  .error-message {
    margin: 0;
    word-break: break-all;
    white-space: pre-wrap;
  }
}
</style>
