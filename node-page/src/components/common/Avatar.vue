<template>
  <el-image
    :src="getAvatarUri(fileKey)"
    class="avatar"
    fit="cover"
    :style="`width: ${size}; height: ${size}; margin: ${margin}`"
  />
</template>

<script>

export default {
  name: 'Avatar',
  props: {
    fileKey: {
      required: true
    },
    size: {
      default: '100%'
    },
    margin: {
      default: '0px'
    }
  }
}
</script>

<style scoped lang="scss">
.avatar {
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
