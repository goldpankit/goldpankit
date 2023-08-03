<template>
  <div class="signup">
    <div class="wrap">
      <h2>Sign Up</h2>
      <el-form ref="form" :model="form" :rules="rules" @submit.stop>
        <el-form-item label="Username" prop="username" required>
          <el-input v-model="form.username" type="text" size="large"/>
        </el-form-item>
        <el-form-item label="Password" prop="password" required>
          <el-input v-model="form.password" type="password" size="large"/>
        </el-form-item>
        <el-form-item label="Email" prop="otpElement" required>
          <el-input v-model="form.otpElement" type="text" size="large">
<!--            <template #prepend>-->
<!--              <span>+86</span>-->
<!--            </template>-->
          </el-input>
        </el-form-item>
        <el-form-item label="OTP code" prop="otpCode" required class="otp-code">
          <div>
            <el-input type="text" v-model="form.otpCode" size="large"/>
            <el-button
              size="large"
              type="primary"
              :disabled="sendOtpCodeData.isWorking || sendOtpCodeData.timeout !== 0"
              @click="sendOtpCode"
            >
              <template v-if="sendOtpCodeData.isWorking">Sending...</template>
              <template v-else-if="sendOtpCodeData.timeout === 0 && !sendOtpCodeData.sended">Send OTP Code</template>
              <template v-else-if="sendOtpCodeData.timeout === 0 && sendOtpCodeData.sended">Resend OTP Code</template>
              <template v-else>{{sendOtpCodeData.timeout}}s</template>
            </el-button>
          </div>
          <p v-if="sendOtpCodeData.sended">tips: We are sending you a OTP code to {{form.otpElement}}. If you do not receive it, you can resend it in 60 seconds.</p>
        </el-form-item>
      </el-form>
      <div class="login-box">
        <div>
          <el-button type="important" @click="regis" :disabled="regisData.isWorking">Create an account</el-button>
        </div>
      </div>
    </div>
    <div class="have-an-account">
      <p>Already have an account?</p>
      <router-link :to="{ name: 'SignIn' }">Sign In</router-link>
    </div>
  </div>
</template>

<script>
import {regisByEmail, sendRegisByEmailOtpCode} from "../api/user.regis";
import {checkEmail} from "../utils/form.check";

export default {
  data () {
    return {
      form: {
        username: '',
        password: '',
        otpElement: '',
        otpCodeId: null,
        otpCode: ''
      },
      rules: {
        username: [
          { required: true, message: 'Please input Username'}
        ],
        password: [
          { required: true, message: 'Please input password'}
        ],
        otpElement: [
          { required: true, message: 'Please input email'},
          { validator: (rule, value, callback) => checkEmail(rule, value, callback, 'Please enter the correct email address')},
        ],
        otpCode: [
          { required: true, message: 'Please input OTP code'},
          { required: true, message: 'Please input OTP code'}
        ],
      },
      sendOtpCodeData: {
        isWorking: false,
        timeout: 0,
        sended: false
      },
      regisData: {
        isWorking: false
      }
    }
  },
  methods: {
    // 注册
    regis () {
      this.$refs.form.validate()
        .then(() => {
          if (this.regisData.isWorking) {
            return
          }
          this.regisData.isWorking = true
          regisByEmail(this.form)
            .then(() => {
              this.$message.success('Register successful.')
              this.$router.push({ name: 'SignIn'})
            })
            .catch(e => {
              this.$tip.apiFailed(e)
            })
            .finally(() => {
              this.regisData.isWorking = false
            })
        })
        .catch(() => {})
    },
    // 发送动态码
    sendOtpCode () {
      this.$refs.form.validateField('otpElement')
        .then(() => {
          if (this.sendOtpCodeData.isWorking) {
            return
          }
          this.sendOtpCodeData.isWorking = true
          sendRegisByEmailOtpCode({
            email: this.form.otpElement,
            username: this.form.username
          })
            .then(data => {
              this.form.otpCodeId = data
              this.sendOtpCodeData.timeout = 60
              this.sendOtpCodeData.sended = true
              const interval = setInterval(() => {
                this.sendOtpCodeData.timeout--
                if (this.sendOtpCodeData.timeout === 0) {
                  clearInterval(interval)
                }
              }, 1000)
            })
            .catch(e => {
              this.$tip.apiFailed(e)
            })
            .finally(() => {
              this.sendOtpCodeData.isWorking = false
            })
        })
        .catch(() => {})
    }
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
  // 表单
  .el-form {
    .otp-code {
      :deep(.el-form-item__content > div) {
        width: 100%;
        display: flex;
      }
      .el-button {
        margin-left: 10px;
        width: 145px;
      }
      p {
        line-height: 20px;
        margin-top: 5px;
        em {
          font-style: normal;
          font-weight: bold;
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
.have-an-account {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  a {
    text-decoration: underline !important;
    margin-top: 15px;
    font-weight: bold;
  }
}
</style>
