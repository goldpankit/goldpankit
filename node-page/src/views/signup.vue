<template>
  <div class="signup">
    <div class="wrap">
      <h2>Sign Up</h2>
      <el-form ref="form" :model="form" @submit.stop>
        <el-form-item label="Username" prop="username" required>
          <el-input v-model="form.username" type="text" size="large"/>
        </el-form-item>
        <el-form-item label="Password" prop="password" required>
          <el-input v-model="form.password" type="password" size="large"/>
        </el-form-item>
        <el-form-item label="Mobile" prop="mobile" required>
          <el-input v-model="form.mobile" type="text" size="large">
            <template #prepend>
              <span>+86</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="Mobile Code" prop="smsCode" required class="mobile-code">
          <div>
            <el-input type="text" v-model="form.smsCode" size="large"/>
            <el-button size="large" type="primary" :disabled="sendSmsData.isWorking || sendSmsData.timeout !== 0" @click="sendSms">
              <template v-if="sendSmsData.isWorking">Sending...</template>
              <template v-else-if="sendSmsData.timeout === 0 && !sendSmsData.sended">Send Code</template>
              <template v-else-if="sendSmsData.timeout === 0 && sendSmsData.sended">Resend Code</template>
              <template v-else>{{sendSmsData.timeout}}s</template>
            </el-button>
          </div>
          <p v-if="sendSmsData.sended">tips: we sended a message to your mobile phone for number <em>{{this.form.mobile}}</em>.you can resend if you are not received our message .</p>
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
import {regisByMobile, sendRegisByMobileSms} from "../api/user.regis";

export default {
  data () {
    return {
      form: {
        username: '',
        password: '',
        mobile: '',
        smsId: null,
        smsCode: ''
      },
      sendSmsData: {
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
          regisByMobile(this.form)
            .then(() => {
              this.$message.info('Register successful.')
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
    // 发送短信验证码
    sendSms () {
      this.$refs.form.validateField('mobile')
        .then(() => {
          if (this.sendSmsData.isWorking) {
            return
          }
          this.sendSmsData.isWorking = true
          sendRegisByMobileSms({
            mobile: this.form.mobile
          })
            .then(data => {
              this.form.smsId = data
              this.sendSmsData.timeout = 60
              this.sendSmsData.sended = true
              const interval = setInterval(() => {
                this.sendSmsData.timeout--
                if (this.sendSmsData.timeout === 0) {
                  clearInterval(interval)
                }
              }, 1000)
            })
            .catch(e => {
              this.$tip.apiFailed(e)
            })
            .finally(() => {
              this.sendSmsData.isWorking = false
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
    .mobile-code {
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
