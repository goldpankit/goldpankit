<template>
  <el-upload
    class="avatar-uploader"
    action="/remote-api/upload/image"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="avatarUrl" :src="avatarUrl" class="avatar" />
  </el-upload>
</template>

<script>

export default {
  name: "AvatarUploader",
  props: {
    avatarUrl: {
      required: true
    }
  },
  methods: {
    handleAvatarSuccess () {},
    beforeAvatarUpload () {}
  }
}
</script>

<style scoped lang="scss">
.el-upload {
  .avatar {
    width: 95px;
    height: 95px;
    object-fit: contain;
    border-radius: 50%;
    margin-bottom: 10px;
  }
}
</style>
