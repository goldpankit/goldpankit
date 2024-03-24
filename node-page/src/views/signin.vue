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
          <el-input
            v-model="form.password"
            show-password
            type="password"
            size="large"
            @keypress.enter.native="login()"
          />
        </el-form-item>
      </el-form>
      <div class="login-box">
        <div>
          <el-button
            type="important"
            :disabled="loginData.isWorking"
            @click="login()"
          >{{$t('common.signIn')}}</el-button>
        </div>
      </div>
    </div>
    <div class="create-account">
      <router-link :to="{ name: 'SignUp' }">{{$t('user.createAccount')}}</router-link>
    </div>
  </div>
</template>

<script>
import cookie from 'js-cookie'
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
    login (force = false) {
      console.log('force', force)
      this.$refs.form.validate()
        .then(() => {
          if (this.loginData.isWorking) {
            return
          }
          this.loginData.isWorking = true
          loginByPassword ({
            ...this.form,
            username: this.form.username.trim(),
            force
          })
            .then(token => {
              cookie.set('x-kit-token', token)
              // 调用接口，将令牌存储在用户设备文件系统中，便于下次自动授权
              return save(token)
            })
            .then(() => {
              // 获取用户信息
              return getLoginInfo()
            })
            .then(userInfo => {
              // 存储用户信息
              this.setUserInfo(userInfo)
              // 获取重定向地址
              const redirect_uri = this.$route.query.redirect_uri
              if (redirect_uri != null && redirect_uri !== '') {
                this.$router.push(redirect_uri)
              } else {
                const backUri = this.$router.options.history.state.back
                /**
                 * 返回页面为null或为注册页面，则跳转到用户桌面去。当直接访问登录页面时，返回页为null。
                 */
                if (backUri == null || backUri === '/signup') {
                  this.$router.push({name: 'Desktop'})
                }
                // 其他页面直接返回
                else {
                  this.$router.back()
                }
              }
            })
            .catch(e => {
              // 账号在其他设备登录
              if (e.code === 6201) {
                this.alert('当前账号已登录，继续登录后其它设备将自动离线，确认要继续登录吗？如果您对当前登录状态存在疑问，建议您登录后尽快修改密码！', '重要提示', {
                  showCancelButton: true,
                  cancelButtonText: '暂不登录',
                  confirmButtonText: '继续登录'
                })
                  .then(() => {
                    this.login(true)
                  })
                return
              }
              this.$tip.apiFailed(e)
            })
            .finally(() => {
              // 标记登录状态为false
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
