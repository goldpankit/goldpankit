<template>
  <el-upload
    class="avatar-uploader"
    action="/remote-api/upload/image"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img :src="url" class="avatar" />
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
  computed: {
    url () {
      console.log('this.modelValue', this.modelValue)
      // 远程路径
      if (this.modelValue.startsWith('/resource')) {
        return import.meta.env.VITE_REMOTE_API_PREFIX + this.modelValue
      }
      return this.modelValue
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
    beforeAvatarUpload () {}
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
