<template>
  <div class="signup">
    <div class="wrap">
      <h2>{{ $t('common.signUp') }}</h2>
      <h3>GoldPanKit账号需要购买，请添加下方微信，我们的客服人员会为您开通账号！</h3>
      <div class="wechat-wrap">
        <img src="/images/wechat.png"/>
        <span>小艺</span>
      </div>
      <div class="price-wrap">
        <h4>价格套餐</h4>
        <el-table :data="priceTableData">
          <el-table-column align="center" prop="dayCount" label="时长"/>
          <el-table-column align="center" prop="price" class-name="price" label="价格"/>
        </el-table>
      </div>
    </div>
    <div class="have-an-account">
      <p>{{$t('user.haveAnAccount')}}</p>
      <router-link :to="{ name: 'SignIn' }">{{$t('common.signIn')}}</router-link>
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
      sendOtpCodeData: {
        isWorking: false,
        timeout: 0,
        sended: false
      },
      regisData: {
        isWorking: false
      },
      // 价格表
      priceTableData: [
        { dayCount: '90天', price: '299元' },
        { dayCount: '365天', price: '799元' }
      ]
    }
  },
  methods: {
    getRules () {
      return {
        username: [
          { required: true, message: this.$t('form.isRequired', { value: this.$t('user.username') })}
        ],
        password: [
          { required: true, message: this.$t('form.isRequired', { value: this.$t('user.password') })}
        ],
        otpElement: [
          { required: true, message: this.$t('form.isRequired', { value: this.$t('user.email') })},
          { validator: (rule, value, callback) => checkEmail(rule, value, callback, this.$t('form.correctEmailTip'))},
        ],
        otpCode: [
          { required: true, message: this.$t('form.isRequired', { value: this.$t('user.otpCode') })},
        ],
      }
    },
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
  // 提示
  h3 {
    font-weight: normal;
  }
  // 微信图片
  .wechat-wrap {
    margin: 20px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      width: 255px;
    }
  }
  // 价格套操
  .price-wrap {
    h4 {
      text-align: center;
      font-size: 16px;
    }
    ::v-deep(.el-table) {
      tbody {
        .cell {
          font-size: 20px;
        }
        .price {
          color: var(--primary-color-match-2);
          font-weight: bold;
        }
      }
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
