<template>
  <div class="signup">
    <div class="wrap">
      <h2>设置新的登录密码</h2>
      <p class="tip">作为一个没有钱的初创团队，为了节省短信开支，我们关闭了短信登录功能，请您谅解！现在请通过验证短信验证码的方式设置新的登录密码，并牢牢的记住它。</p>
      <!-- 表单 -->
      <el-form ref="form" :model="form" @submit.stop>
        <el-form-item label="手机号码（仅支持中国大陆）" prop="otpElement">
          <el-input
            v-model="form.otpElement"
            size="large"
            maxlength="11"
            @input="check"
          />
        </el-form-item>
        <el-form-item label="短信验证码" prop="otpCode">
          <div class="otp-input">
            <el-input
              v-model="form.otpCode"
              size="large"
              maxlength="4"
              @input="check"
            />
            <el-button
              type="primary"
              :disabled="disabledSendOTPButton"
              @click="sendOTP"
            >{{ sendOTPData.buttonText }}</el-button>
          </div>
        </el-form-item>
        <el-form-item class="password-item" label="新的登录密码" prop="newPassword">
          <el-input
            v-model="form.newPassword"
            show-password
            type="password"
            size="large"
            maxlength="20"
            @input="check"
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
            :disabled="disabledConfirmButton"
            @click="confirm"
          >确认设置</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import cookie from "js-cookie";
import Logo from '@/components/common/Logo.vue'
import { updateByMobileOTP, sendUpdatePasswordMobileOTP } from '@/api/user.password'
import { save } from '@/api/user.token'
import {getLoginInfo} from "@/api/user.login";

export default {
  components: { Logo },
  data () {
    return {
      isWorking: {
        update: false,
        sendOTP: false
      },
      errorTip: '',
      // 密码登录表单
      form: {
        otpElement: '',
        otpCodeId: null,
        otpCode: '',
        newPassword: ''
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
    // 确认按钮是否禁用
    disabledConfirmButton () {
      if (this.isWorking.update) {
        return true
      }
      if (this.form.newPassword.trim() === '') {
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
     * 确认修改
     */
    confirm () {
      if (this.disabledConfirmButton) {
        return
      }
      // 基础验证
      if (!this.check()) {
        return
      }
      // 验证验证码
      if (this.form.otpCodeId == null) {
        this.errorTip = '短信验证码不正确'
        return
      }
      this.isWorking.update = true
      this.form.newPassword = this.form.newPassword.trim()
      updateByMobileOTP(this.form)
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
          this.isWorking.update = false
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
      sendUpdatePasswordMobileOTP({
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
    },
    // 验证
    check () {
      // 密码长度必须大于6位
      if (this.form.newPassword.trim().length < 6) {
        this.errorTip = '密码长度至少为6位'
        return false
      }
      this.errorTip = ''
      return true
    }
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
  padding: 100px 50px 100px 50px;
  background-color: var(--color-light);
  box-sizing: border-box;
  box-shadow: var(--page-shadow);
  border-radius: var(--radius-page);
  position: absolute;
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
  // 提示
  & > p.tip {
    background-color: var(--primary-color-match-2);
    padding: 8px 15px;
    border-radius: 10px;
    color: #fff;
    margin-bottom: 20px;
  }
  :deep(.el-form) {
    .el-form-item__label {
      font-weight: bold;
    }
    // 输入框
    .el-input__inner {
      font-weight: bold;
      letter-spacing: 2px;
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
</style>
