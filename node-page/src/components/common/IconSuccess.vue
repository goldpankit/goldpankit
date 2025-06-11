<template>
  <span class="icon-success">
    <el-icon><Check/></el-icon>
  </span>
</template>

<script>

export default {
  name: 'IconSuccess',
}
</script>

<style scoped lang="scss">
.icon-success {
  --icon-size: 45px;
  --icon-font-size: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--icon-size);
  height: var(--icon-size);
  border-radius: 50%;
  background-color: var(--color-success);
  .el-icon {
    font-size: var(--icon-font-size);
    color: var(--color-light);
  }
}
</style>
