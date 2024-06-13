<template>
  <div class="page">
    <div v-if="copyUserInfo != null" class="wrap">
      <div class="avatar-wrap">
        <AvatarUploader v-model="copyUserInfo.avatar"/>
        <h2>{{getUserDisplayName(copyUserInfo)}}</h2>
      </div>
      <el-form ref="form" :model="copyUserInfo" :rules="rules">
        <el-form-item label="昵称" prop="nickname" required>
          <el-input size="large" v-model="copyUserInfo.nickname" maxlength="20"/>
        </el-form-item>
        <el-form-item :label="$t('common.introduce')" prop="introduce">
          <el-input
            size="large"
            v-model="copyUserInfo.introduce"
            type="textarea"
            :rows="5"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div class="opera">
        <el-button size="large"  @click="$router.push({ name: 'Desktop' })" icon="Back">返回</el-button>
        <el-button type="primary" size="large" :disabled="isWorking" @click="save">保存资料</el-button>
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
      isWorking: false,
      rules: {
        nickname: [
          {required: true, message: '请输入昵称', trigger: 'blur'}
        ]
      }
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
      this.$refs.form.validate((pass) => {
        if (!pass) {
          return
        }
        this.isWorking = true
        // 去掉两侧空格
        this.copyUserInfo.nickname = this.copyUserInfo.nickname.trim()
        this.copyUserInfo.introduce = this.copyUserInfo.introduce == null ? null : this.copyUserInfo.introduce.trim()
        saveProfile({
          nickname: this.copyUserInfo.nickname,
          introduce: this.copyUserInfo.introduce
        })
          .then(()  => {
            this.setUserInfo(this.copyUserInfo)
            this.$router.push({name: 'Desktop'})
          })
          .catch(e => {
            this.$tip.apiFailed(e)
          })
          .finally(() => {
            this.isWorking = false
          })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.page {
  .wrap {
    width: 500px;
    margin: 0 auto;
    padding: 50px 50px 50px 50px;
    background-color: var(--color-light);
    box-sizing: border-box;
    box-shadow: var(--page-shadow);
    border-radius: var(--radius-page);
    .avatar-wrap {
      display: flex;
      align-items: center;
      flex-direction: column;
      margin-bottom: 50px;
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
