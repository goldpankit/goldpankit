<template>
  <el-input-number class="install-number-input"/>
</template>

<script>
export default {
  name: "InstallNumberInput",
  props: {
    type: {
      default: 'text'
    }
  }
}
</script>

<style scoped lang="scss">
.install-number-input {
  :deep(.el-input__wrapper) {
    padding: 0 11px;
  }
  :deep(.el-input__inner) {
    text-align: left;
    font-weight: bold;
    font-size: var(--font-size-middle);
  }
}
</style>
