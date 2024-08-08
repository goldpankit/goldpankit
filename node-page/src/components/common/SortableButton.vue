<template>
  <span class="sortable-button" style="cursor: move">
    <el-icon><Grid /></el-icon>
  </span>
</template>

<script>

export default {
  name: "SortableButton"
}
</script>

<style scoped lang="scss">
.sortable-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  .el-icon {
    font-size: 20px;
    color: #999;
    transition: all ease .15s;
    &:hover {
      color: #333;
    }
  }
}
</style>
