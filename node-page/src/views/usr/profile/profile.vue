<template>
  <div class="page">
    <div v-if="copyUserInfo != null" class="wrap">
      <div class="avatar-wrap">
        <AvatarUploader v-model="copyUserInfo.avatar"/>
        <h2>{{copyUserInfo.username}}</h2>
      </div>
      <div class="introduce-wrap">
        <label>Introduce</label>
        <el-input v-model="copyUserInfo.introduce" type="textarea" :rows="5"/>
      </div>
      <div class="opera">
        <el-button type="primary" size="large" :disabled="isWorking" @click="save">Save</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import AvatarUploader from "../../../components/common/AvatarUploader.vue";
import {mapMutations, mapState} from "vuex";
import {saveProfile} from "../../../api/user";

export default {
  components: {AvatarUploader},
  computed: {
    ...mapState(['userInfo'])
  },
  data () {
    return {
      copyUserInfo: null,
      isWorking: false
    }
  },
  watch: {
    userInfo: {
      immediate: true,
      handler: function () {
        this.copyUserInfo = JSON.parse(JSON.stringify(this.userInfo))
      }
    }
  },
  methods: {
    ...mapMutations(['setUserInfo']),
    // 保存资料
    save () {
      if (this.isWorking) {
        return
      }
      this.isWorking = true
      saveProfile(this.copyUserInfo)
        .then(()  => {
          this.setUserInfo(this.copyUserInfo)
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
        .finally(() => {
          this.isWorking = false
        })
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
