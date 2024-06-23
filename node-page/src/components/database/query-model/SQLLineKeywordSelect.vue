<template>
  <el-select class="sql-line-keyword-select" size="default" :style="{ width }">
    <el-option
      v-for="item in data"
      :key="item"
      :value="item"
      :label="item"
    />
  </el-select>
</template>

<script>

export default {
  name: "SQLLineKeywordSelect",
  props: {
    width: {
      default: '120px'
    },
    data: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.el-select.sql-line-keyword-select {
  :deep(.el-select__wrapper) {
    min-height: 20px;
    height: 20px;
    background: #faebeb;
    padding: 2px 5px;
    box-shadow: none !important;
    .el-select__selected-item {
      color: var(--primary-color-match-2);
    }
    .el-select__suffix {
      display: none;
    }
  }
}
</style>
