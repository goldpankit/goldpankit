<template>
  <el-select>
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
    data: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.el-select {
  &.keyword {
    :deep(.el-input__inner) {
      color: var(--primary-color-match-2);
    }
  }
  &.relation {
    :deep(.el-input__inner) {
      background: #e5ffda;
    }
  }
  :deep(.el-input__wrapper) {
    padding: 0;
    box-shadow: none !important;
  }
  :deep(.el-input) {
    &.is-focus .el-input__wrapper {
      box-shadow: none !important;
    }
  }
  :deep(.el-input__inner) {
    --el-input-inner-height: 20px;
    font-size: 15px;
    background: #faebeb;
    padding: 2px 5px;
  }
  :deep(.el-input__suffix) {
    display: none;
  }
}
</style>
