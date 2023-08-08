<template>
  <div class="signup">
    <div class="wrap">
      <h2>{{$t('common.signIn')}}</h2>
      <el-form ref="form" :model="form" :rules="getRules()" @submit.stop>
        <el-form-item :label="$t('user.username')" prop="username" required>
          <el-input v-model="form.username" type="text" size="large"/>
        </el-form-item>
        <el-form-item class="password-item" :label="$t('user.password')" prop="password" required>
          <template #label>
            <label>{{$t('user.password')}}</label>
<!--            <router-link to="#">{{$t('user.forgotPassword')}}</router-link>-->
          </template>
          <el-input v-model="form.password" show-password type="password" size="large" @keypress.enter.native="login"/>
        </el-form-item>
      </el-form>
      <div class="login-box">
        <div>
          <el-button type="important" :disabled="loginData.isWorking" @click="login">{{$t('common.signIn')}}</el-button>
        </div>
      </div>
    </div>
    <div class="create-account">
      <router-link :to="{ name: 'SignUp' }">{{$t('user.createAccount')}}</router-link>
    </div>
  </div>
</template>

<script>

import {loginByPassword, getLoginInfo} from "../api/user.login";
import {save} from "../api/user.token";
import {mapMutations} from "vuex";

export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      loginData: {
        isWorking: false
      }
    }
  },
  methods: {
    ...mapMutations(['setUserInfo']),
    getRules () {
      return {
        username: [
          { required: true, message: this.$t('form.isRequired', { value: this.$t('user.username') })}
        ],
        password: [
          { required: true, message: this.$t('form.isRequired', { value: this.$t('user.password') })}
        ]
      }
    },
    // 密码登录
    login () {
      this.$refs.form.validate()
        .then(() => {
          if (this.loginData.isWorking) {
            return
          }
          this.loginData.isWorking = true
          loginByPassword (this.form)
            .then(data => {
              return data
            })
            .then(token => {
              document.cookie = `x-kit-token=${token};`
              // 调用接口，将令牌存储在用户设备文件系统中，便于下次自动授权
              save(token)
            })
            .then(() => {
              // 存储用户信息
              getLoginInfo()
                .then(userInfo => {
                  this.setUserInfo(userInfo)
                  this.$router.push({ name: 'Desktop' })
                })
            })
            .catch(e => {
              this.$tip.apiFailed(e)
            })
            .finally(() => {
              this.loginData.isWorking = false
            })
        })
        .catch(() => {})
    },
  }
}
</script>

<style scoped lang="scss">
.signup {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  padding: 50px 0;
}
.wrap {
  width: 500px;
  padding: 50px 30px;
  background-color: var(--color-light);
  box-sizing: border-box;
  box-shadow: var(--page-shadow);
  border-radius: var(--radius-page);
  // 头部
  h2 {
    padding: 10px 0 60px 0;
    font-size: 30px;
    text-align: center;
  }
  :deep(.el-form) {
    .password-item {
      .el-form-item__label {
        position: relative;
        a {
          position: absolute;
          top: 0;
          right: 0;
          text-decoration: underline !important;
        }
      }
    }
  }
  .login-box {
    margin-top: 50px;
    .el-button {
      width: 100%;
      height: 55px;
      border: 0;
      font-weight: bold;
      font-size: 20px;
    }
  }
}
.create-account {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  a {
    text-decoration: underline !important;
    font-weight: bold;
  }
}
</style>
