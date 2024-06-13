<template>
  <div class="signup">
    <div class="background-text">
      <p>我<em style="color: #999;">无力</em>创办一个<em>伟大</em>的公司</p>
      <p>但我的<em>人生</em>依然需要满意的<em>作品</em><br/><em style="font-size: 30px;">加油，刘大逵！！</em></p>
    </div>
    <div class="wrap">
      <!-- Logo -->
      <Logo :with-version="false" :with-animation="true"/>
      <h2>登录KIT</h2>
      <!-- 表单 -->
      <el-form ref="form" :model="form" @submit.stop>
        <el-form-item label="用户名或手机号码" prop="username">
          <el-input ref="username" v-model="form.username" type="text" size="large"/>
        </el-form-item>
        <el-form-item class="password-item" label="登录密码" prop="password">
          <el-input
            v-model="form.password"
            show-password
            type="password"
            size="large"
            @keypress.enter.native="login()"
          />
        </el-form-item>
      </el-form>
      <!-- 错误提示 -->
      <p class="text-danger" style="height: 40px;">{{ errorTip }}</p>
      <!-- 底部操作 -->
      <div class="footer-wrap">
        <div>
          <el-button
            type="important"
            :disabled="disabledLoginButton"
            @click="login()"
          >{{$t('common.signIn')}}</el-button>
        </div>
      </div>
      <div class="create-account">
        <router-link :to="{ name: 'SignUp' }">创建新账号</router-link>
        <router-link :to="{ name: 'SignUp' }">忘记密码了</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import cookie from 'js-cookie'
import Logo from '@/components/common/Logo'
import { loginByPassword, getLoginInfo } from '@/api/user.login'
import { save } from '@/api/user.token'

export default {
  components: { Logo },
  data () {
    return {
      errorTip: '',
      isWorking: {
        login: false
      },
      // 密码登录表单
      form: {
        username: '',
        password: ''
      }
    }
  },
  computed: {
    disabledLoginButton () {
      if (this.isWorking.login) {
        return true
      }
      if (this.form.username.trim() === '') {
        return true
      }
      return this.form.password.trim() === ''
    }
  },
  methods: {
    ...mapMutations(['setUserInfo']),
    // 密码登录
    login (force = false) {
      if (this.disabledLoginButton) {
        return
      }
      this.errorTip = ''
      this.isWorking.login = true
      loginByPassword ({
        username: this.form.username.trim(),
        password: this.form.password.trim(),
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
          localStorage.setItem('login_username', this.form.username)
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
          this.errorTip = e.message
        })
        .finally(() => {
          // 标记登录状态为false
          this.isWorking.login = false
        })
    }
  },
  mounted () {
    const username = localStorage.getItem('login_username')
    if (username) {
      this.form.username = username
    }
    this.$refs.username.focus()
  }
}
</script>

<style scoped lang="scss">
.signup {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.background-text {
  width: 1200px;
  font-size: 40px;
  line-height: 120px;
  font-style: italic;
  color: #e5e5e5;
  position: absolute;
  display: flex;
  justify-content: space-between;
  background-color: var(--background-color);
  p {
    width: 300px;
    em {
      font-size: 70px;
      font-weight: bold;
      margin: 0 10px;
      color: var(--primary-color-match-2);
      opacity: .25;
    }
    &:first-of-type {
      margin-top: 100px;
    }
    &:last-of-type {
      margin-top: 300px;
    }
  }
}
.wrap {
  width: 500px;
  padding: 100px 50px 200px 50px;
  background-color: var(--color-light);
  box-sizing: border-box;
  box-shadow: var(--page-shadow);
  border-radius: var(--radius-page);
  position: absolute;
  z-index: 99;
  .logo {
    justify-content: center;
    margin-bottom: 100px;
  }
  h2 {
    font-size: 25px;
    text-align: center;
    transition: all ease .15s;
    margin-bottom: 50px;
  }
  :deep(.el-form) {
    .el-form-item__label {
      font-weight: bold;
    }
    // 输入框
    .el-input__inner {
      font-weight: bold;
      font-size: var(--font-size-middle);
      letter-spacing: 2px;
      text-align: center;
    }
  }
  .footer-wrap {
    margin-top: 60px;
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
  justify-content: flex-end;
  a {
    text-decoration: underline !important;
    font-weight: bold;
    &:first-of-type {
      margin-right: 20px;
    }
  }
}
</style>
