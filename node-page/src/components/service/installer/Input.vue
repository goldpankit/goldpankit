<template>
  <el-input class="install-input" size="large"/>
</template>

<script>
export default {
  name: "InstallInput"
}
</script>

<style scoped lang="scss">
.install-input {
  :deep(.el-input__inner) {
    color: var(--primary-color-match-2);
    font-weight: bold;
    font-size: var(--font-size-middle);
  }
}
</style>
