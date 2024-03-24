<template>
  <div class="signup">
    <div class="wrap">
      <h2>修改密码</h2>
      <el-form ref="form" :model="form" :rules="rules" @submit.stop>
        <el-form-item label="原始密码" prop="password" required>
          <el-input
            v-model="form.password"
            show-password
            type="password"
            size="large"
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword" required>
          <el-input
            v-model="form.newPassword"
            show-password
            type="password"
            size="large"
          />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmNewPassword" required>
          <el-input
            v-model="form.confirmNewPassword"
            show-password
            type="password"
            size="large"
          />
        </el-form-item>
      </el-form>
      <div class="login-box">
        <div>
          <el-button
            type="important"
            :disabled="isWorking.update"
          >确认修改</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isWorking: {
        update: false
      },
      form: {
        password: '',
        newPassword: '',
        confirmNewPassword: '',
      },
      rules: {
        password: [
          { required: true, message: '请输入原始密码' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码' }
        ],
        confirmNewPassword: [
          { required: true, message: '请再次输入新密码' }
        ]
      }
    }
  },
  methods: {
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
</style>
