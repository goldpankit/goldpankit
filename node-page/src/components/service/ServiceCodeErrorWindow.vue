<template>
  <el-dialog
    v-model="visible"
    width="1000px"
    custom-class="service-code-error-window"
    :show-close="false"
  >
    <template #header>
      <div class="window-header-wrap">
        <div class="title">
          <el-icon><CircleCloseFilled /></el-icon>
          <h5>{{$t('service.serviceCodeErrorTitle')}}</h5>
        </div>
        <p class="tip">{{$t('service.serviceCodeErrorTip')}}</p>
      </div>
    </template>
    <div class="window-content-wrap">
      <p>at {{error.position}}</p>
      <pre>{{error.message}}</pre>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "ServiceCodeErrorWindow",
  data () {
    return {
      visible: false,
      error: null
    }
  },
  methods: {
    open (error) {
      this.error = error
      this.visible = true
    }
  }
}
</script>

<style lang="scss">
.service-code-error-window {
  .el-dialog__header,.el-dialog__body {
    padding: 0;
    margin-right: 0;
  }
  .window-header-wrap {
    background: var(--color-danger);
    padding: 10px 20px;
    .title {
      display: flex;
      align-items: center;
      color: var(--color-light);
      .el-icon {
        font-size: 22px;
        margin-right: 5px;
      }
      h5 {
        font-size: var(--font-size-middle);
      }
    }
    p {
      color: var(--color-light);
      margin-top: 5px;
    }
  }
  .window-content-wrap {
    color: var(--color-danger);
    padding: 20px;
    & > p {
      font-weight: bold;
    }
    & > pre {
      white-space: pre-wrap;
      padding-left: 20px;
    }
  }
}
</style>
