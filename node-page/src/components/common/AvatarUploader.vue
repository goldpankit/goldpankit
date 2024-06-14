<template>
  <el-upload
    class="avatar-uploader"
    action="/remote-api/upload/image"
    :show-file-list="false"
    accept=".jpeg,.png,.jpg,.gif"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <Avatar :file-key="modelValue"/>
    <div class="tip-wrap">
      <span>修改头像</span>
    </div>
  </el-upload>
</template>

<script>
export default {
  name: 'AvatarUploader',
  props: {
    modelValue: {
      required: true
    }
  },
  methods: {
    handleAvatarSuccess (res) {
      if (!res.success) {
        this.$tip.apiFailed(res)
        return
      }
      this.$emit('update:modelValue', res.data.fileKey)
      this.$emit('uploaded', res.data.fileKey)
    },
    beforeAvatarUpload (rawFile) {
      if (rawFile.size / 1024 / 1024 > 2) {
        this.$tip.error('Avatar picture size can not exceed 2MB!')
        return false
      }
      return true
    }
  }
}
</script>

<style scoped lang="scss">
.avatar-uploader {
  width: 95px;
  height: 95px;
  position: relative !important;
  &:hover {
    .tip-wrap {
      opacity: 1;
    }
  }
  :deep(.el-upload) {
    width: 100%;
    height: 100%;
  }
  .tip-wrap {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    position: absolute;
    background: rgba(0, 0, 0, 0.5);
    top: 0;
    left: 0;
    opacity: 0;
    transition: opacity 0.15s;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }
}
</style>
