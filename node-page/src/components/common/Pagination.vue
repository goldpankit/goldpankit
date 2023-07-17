<template>
  <el-pagination
    :class="{ [`pagination__${position}`]: true }"
    v-model:current-page="pagination.page"
    v-model:page-size="pagination.capacity"
    layout="prev, pager, next, jumper"
    :total="pagination.total"
    :hide-on-single-page="true"
  />
</template>

<script>
export default {
  name: "Pagination",
  props: {
    pagination: {
      required: true
    },
    // top, bottom
    position: {
      default: 'bottom'
    }
  }
}
</script>

<style scoped lang="scss">
.el-pagination {
  --el-pagination-button-height: 40px;
  --el-component-size: 40px;
  justify-content: flex-end;
  :deep(.btn-prev), :deep(.btn-next) {
    &:hover {
      color: var(--font-color);
      font-weight: bold;
    }
  }
  &.pagination__top {
    margin-bottom: 20px;
  }
  &.pagination__bottom {
    margin-top: 20px;
  }
}
</style>
