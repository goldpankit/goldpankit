<template>
  <el-input :type="type" :rows="rows" class="install-input"/>
</template>

<script>
export default {
  name: "InstallInput",
  props: {
    type: {
      default: 'text'
    },
    rows: {
      default: 3
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
