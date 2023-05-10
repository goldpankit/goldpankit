<template>
  <el-pagination
    class="pagination"
    v-model:current-page="pagination.page"
    v-model:page-size="pagination.capacity"
    layout="prev, pager, next, jumper"
    :total="pagination.total"
    @size-change="$emit('size-change')"
    @current-change="$emit('current-change')"
  />
</template>

<script>
export default {
  name: "Pagination",
  props: {
    pagination: {
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.el-pagination {
  --el-pagination-button-height: 40px;
  --el-component-size: 40px;
  :deep(.btn-prev), :deep(.btn-next) {
    &:hover {
      color: var(--font-color);
      font-weight: bold;
    }
  }
}
</style>
