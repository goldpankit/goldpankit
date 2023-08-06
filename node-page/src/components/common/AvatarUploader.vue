<template>
  <el-upload
    class="avatar-uploader"
    action="/remote-api/upload/image"
    :show-file-list="false"
    accept=".jpeg,.png,.jpg,.gif"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img :src="getAccessUri(modelValue)" class="avatar" />
  </el-upload>
</template>

<script>

export default {
  name: "AvatarUploader",
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
      this.$emit('update:modelValue', res.data.accessUri)
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
.el-upload {
  .avatar {
    width: 95px;
    height: 95px;
    object-fit: cover;
    border-radius: 50%;
    margin-bottom: 10px;
  }
}
</style>
