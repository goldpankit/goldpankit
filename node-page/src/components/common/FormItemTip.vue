<template>
  <div class="form-item-tip">
    <el-icon v-if="withIcon"><InfoFilled /></el-icon>
    <p v-html="content"></p>
  </div>
</template>

<script>

export default {
  name: "FormItemTip",
  props: {
    // 提示内容
    content: {
      required: true
    },
    // 是否携带图标
    withIcon: {
      default: true
    }
  }
}
</script>

<style scoped lang="scss">
.form-item-tip {
  display: flex;
  margin-top: 5px;
  .el-icon {
    margin-top: 2px;
    margin-right: 5px;
  }
  p {
    color: var(--color-gray);
    line-height: 1.5;
    font-size: var(--font-size-mini);
    :deep(em) {
      font-style: normal;
      color: var(--font-color);
      margin: 0 5px;
    }
  }
}
</style>
