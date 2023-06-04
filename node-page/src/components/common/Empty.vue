<template>
  <div class="empty">
    <el-empty v-if="withImage" :image="image" :image-size="imageSize" :description="description"/>
    <div class="no-image-empty">
      {{description}}
    </div>
  </div>
</template>

<script>
export default {
  name: "Empty",
  props: {
    withImage: {
      default: false
    },
    image: {},
    imageSize: {},
    description: {
      default: 'No Data'
    }
  }
}
</script>

<style scoped lang="scss">
.empty {
  .no-image-empty {
    padding: 40px 0;
    color: #909399;
    display: flex;
    justify-content: center;
    line-height: 32px;
  }
}
</style>
