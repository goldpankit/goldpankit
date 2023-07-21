<template>
  <div class="signup">
    <div class="wrap">
      <h2>Sign In</h2>
      <el-form ref="form" :model="form" @submit.stop>
        <el-form-item label="Username" prop="username" required>
          <el-input v-model="form.username" type="text" size="large"/>
        </el-form-item>
        <el-form-item class="password-item" label="Password" prop="password" required>
          <template #label>
            <label>Password</label>
            <router-link to="#">Forgot Password</router-link>
          </template>
          <el-input v-model="form.password" show-password type="password" size="large" @keypress.enter.native="login"/>
        </el-form-item>
      </el-form>
      <div class="login-box">
        <div>
          <el-button type="important" :disabled="loginData.isWorking" @click="login">Sign In</el-button>
        </div>
      </div>
    </div>
    <div class="create-account">
      <router-link :to="{ name: 'SignUp' }">Create Account</router-link>
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
                  this.$router.push({ name: 'Index' })
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
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  padding: 50px 0;
}
.wrap {
  width: 500px;
  padding: 30px;
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
