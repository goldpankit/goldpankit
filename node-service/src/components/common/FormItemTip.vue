<template>
  <p class="form-item-tip"><i class="el-icon-warning-outline"></i><slot></slot></p>
</template>

<script>
export default {
  name: 'FormItemTip'
}
</script>

<style scoped lang="scss">
.form-item-tip {
  line-height: 20px;
  font-size: 13px;
  color: #999;
  margin: 6px 0 0 0;
  .el-icon-warning-outline {
    font-size: 16px;
    margin-right: 5px;
    position: relative;
    top: 2px;
    color: orange;
  }
}
</style>
