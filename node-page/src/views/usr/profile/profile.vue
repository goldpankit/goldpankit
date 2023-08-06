<template>
  <div class="page">
    <div v-if="copyUserInfo != null" class="wrap">
      <div class="avatar-wrap">
        <AvatarUploader v-model="copyUserInfo.avatar"/>
        <el-input v-model="copyUserInfo.nickname"></el-input>
      </div>
      <div class="introduce-wrap">
        <label>Introduce</label>
        <el-input type="textarea" :rows="5"/>
      </div>
      <div class="opera">
        <el-button type="primary" size="large">Save</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import AvatarUploader from "../../../components/common/AvatarUploader.vue";
import {mapState} from "vuex";

export default {
  components: {AvatarUploader},
  computed: {
    ...mapState(['userInfo'])
  },
  data () {
    return {
      copyUserInfo: null
    }
  },
  watch: {
    userInfo () {
      this.copyUserInfo = JSON.parse(JSON.stringify(this.userInfo))
    }
  }
}
</script>

<style scoped lang="scss">
.page {
  .wrap {
    width: var(--form-width);
    margin: 0 auto;
    background: var(--color-light);
    padding: var(--gap-page-padding);
    .avatar-wrap {
      display: flex;
      align-items: center;
      flex-direction: column;
      :deep(.el-input) {
        width: 120px;
        font-size: var(--font-size-middle);
        .el-input__inner {
          text-align: center;
          font-weight: bold;
        }
      }
    }
    .introduce-wrap {
      width: 450px;
      margin: 0 auto;
    }
    .opera {
      margin-top: 30px;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
