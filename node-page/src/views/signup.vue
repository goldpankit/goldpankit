<template>
  <div class="signup">
    <div class="wrap">
      <h2>Sign Up</h2>
      <el-form :model="form">
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
        <el-form-item label="Mobile Code" prop="mobileCode" required>
          <div class="mobile-code">
            <el-input type="text" v-model="form.mobileCode" size="large"/>
            <el-button size="large" type="primary">Send Code</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div class="login-box">
        <div>
          <el-button type="important">Create an account</el-button>
        </div>
      </div>
    </div>
    <div class="have-an-account">
      <p>Already have an account?</p>
      <router-link :to="{ name: 'Login' }">Sign In</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      form: {
        username: '',
        password: '',
        mobile: '',
        mobileCode: ''
      }
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
      width: 100%;
      display: flex;
      .el-button {
        margin-left: 10px;
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
