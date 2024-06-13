<template>
  <div class="signup">
    <div class="background-text">
      <p>世界因<em style="color: #333;">技术</em>变得更简洁，每个技术人都值得<em>更好</em>！</p>
      <p>让我的作品替我<em>致敬</em>每一个<em style="font-size: 40px;color: #000;">技术人</em>！</p>
    </div>
    <div class="wrap">
      <!-- Logo -->
      <Logo :with-version="false" :with-animation="true"/>
      <!-- 标题 -->
      <h2>注册KIT账号，开启极速研发</h2>
      <!-- 表单 -->
      <el-form ref="form" :model="form" @submit.stop>
        <el-form-item label="希望网友如何称呼您？" prop="nickname">
          <el-input v-model="form.nickname" type="text" size="large" maxlength="20"/>
        </el-form-item>
        <el-form-item label="登录用户名" prop="username">
          <el-input v-model="form.username" type="text" placeholder="非必填" size="large" maxlength="50"/>
        </el-form-item>
        <el-form-item class="password-item" label="登录密码" prop="password">
          <el-input
            v-model="form.password"
            show-password
            type="password"
            size="large"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item label="手机号码" prop="otpElement">
          <el-input
            v-model="form.otpElement"
            size="large"
            maxlength="11"
          />
        </el-form-item>
        <el-form-item label="短信验证码" prop="otpCode">
          <div class="otp-input">
            <el-input
              v-model="form.otpCode"
              size="large"
              maxlength="4"
            />
            <el-button
              type="primary"
              :disabled="disabledSendOTPButton"
              @click="sendOTP"
            >{{ sendOTPData.buttonText }}</el-button>
          </div>
        </el-form-item>
      </el-form>
      <p class="text-danger" style="height: 40px;">{{ errorTip }}</p>
      <!-- 底部操作 -->
      <div class="footer-wrap">
        <div>
          <el-button
            type="important"
            :disabled="disabledRegisButton"
            @click="regis"
          >注册KIT账号</el-button>
        </div>
      </div>
      <div class="create-account">
        <router-link :to="{ name: 'SignIn' }">已有账号？点击登录</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import cookie from "js-cookie";
import Logo from '@/components/common/Logo'
import { regisByMobileOTP, sendRegisMobileOTP } from '@/api/user.regis'
import { save } from '@/api/user.token'
import {getLoginInfo} from "@/api/user.login";

export default {
  components: { Logo },
  data () {
    return {
      isWorking: {
        regis: false,
        sendOTP: false
      },
      errorTip: ' ',
      // 密码登录表单
      form: {
        nickname: '',
        username: '',
        password: '',
        otpElement: '',
        otpCodeId: null,
        otpCode: ''
      },
      sendOTPData: {
        time: 60,
        buttonText: '发送验证码'
      }
    }
  },
  computed: {
    // 发送验证码按钮是否禁用
    disabledSendOTPButton () {
      if (this.isWorking.sendOTP) {
        return true
      }
      if (this.form.otpElement.trim() === '') {
        return true
      }
      return !/^1[3456789]\d{9}$/.test(this.form.otpElement);
    },
    // 注册按钮是否禁用
    disabledRegisButton () {
      if (this.isWorking.regis) {
        return true
      }
      if (this.form.nickname.trim() === '') {
        return true
      }
      if (this.form.password.trim() === '') {
        return true
      }
      if (this.form.otpElement.trim() === '') {
        return true
      }
      if (!/^1[3456789]\d{9}$/.test(this.form.otpElement)) {
        return true
      }
      return this.form.otpCode.trim() === '';
    }
  },
  methods: {
    ...mapMutations(['setUserInfo']),
    /**
     * 注册
     */
    regis () {
      if (this.disabledRegisButton) {
        return
      }
      this.errorTip = ''
      // 验证验证码
      if (this.form.otpCodeId == null) {
        this.errorTip = '短信验证码不正确'
        return
      }
      this.isWorking.regis = true
      regisByMobileOTP(this.form)
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
          // 跳转桌面
          this.$router.push({name: 'Desktop'})
        })
        .catch(e => {
          this.errorTip = e.message
        })
        .finally(() => {
          this.isWorking.regis = false
        })
    },
    /**
     * 发送短信验证码
     */
    sendOTP () {
      if (this.disabledSendOTPButton) {
        return
      }
      this.errorTip = ''
      this.isWorking.sendOTP = true
      sendRegisMobileOTP({
        mobile: this.form.otpElement
      })
        .then(otpCodeId => {
          this.form.otpCodeId = otpCodeId
          // 倒计时
          this.sendOTPData.buttonText = `${this.sendOTPData.time}s`
          const interval = setInterval(() => {
            if (this.sendOTPData.time === 0) {
              clearInterval(interval)
              this.sendOTPData.buttonText = '发送验证码'
              this.sendOTPData.time = 60
              this.isWorking.sendOTP = false
            } else {
              this.sendOTPData.time--
              this.sendOTPData.buttonText = `${this.sendOTPData.time}s`
            }
          }, 1000)
        })
        .catch(e => {
          this.errorTip = e.message
          this.isWorking.sendOTP = false
        })
    }
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
.background-text {
  width: 1200px;
  font-size: 40px;
  line-height: 120px;
  font-style: italic;
  color: #e5e5e5;
  position: absolute;
  display: flex;
  justify-content: space-between;
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
  padding: 50px 50px 50px 50px;
  background-color: var(--color-light);
  box-sizing: border-box;
  box-shadow: var(--page-shadow);
  border-radius: var(--radius-page);
  position: relative;
  z-index: 99;
  .logo {
    justify-content: center;
    margin-bottom: 50px;
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
    }
    // 短信验证码输入
    .otp-input {
      width: 100%;
      display: flex;
      .el-input {
        flex: 1;
      }
      .el-button {
        width: 150px;
        height: 40px;
        margin-left: 10px;
      }
    }
  }
  .footer-wrap {
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
