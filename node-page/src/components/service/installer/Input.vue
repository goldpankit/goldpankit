<template>
  <el-input :type="type" class="install-input"/>
</template>

<script>
export default {
  name: "InstallInput",
  props: {
    type: {
      default: 'text'
    }
  }
}
</script>

<style scoped lang="scss">
.install-input {
  :deep(.el-input__inner) {
    font-weight: bold;
    font-size: var(--font-size-middle);
  }
}
</style>
