<template>
  <div class="login-wrap">
    <h2>Log In</h2>
    <div class="input-box">
      <el-input type="text" placeholder="username / mobile / email"/>
      <el-input type="text" placeholder="password"/>
      <span>create new account</span>
    </div>
    <div class="login-box">
      <el-button>Log In</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login'
}
</script>

<style scoped lang="scss">
.login-wrap {
  width: 400px;
  padding: 40px 30px;
  background-color: #fff;
  box-sizing: border-box;
  position: absolute;
  right: 172px;
  top: 130px;
  // 头部
  h2 {
    padding: 10px 0 60px 0;
    font-size: var(--font-size-big);
    text-align: center;
  }
  .input-box {
    text-align: right;
    font-size: var(--font-size);
    .el-input {
      margin-bottom: 20px;
      :deep(.el-input__inner) {
        padding: 20px 0!important;
      }
    }
    span {
      cursor: pointer;
    }
  }
  .login-box {
    margin-top: 50px;
    .el-button {
      width: 100%;
      height: 55px;
      border: 0;
      font-weight: bold;
      background-color: var(--primary-color);
      color: var(--font-color);
      &:hover {
        color: var(--font-color);
      }
      &:active {
        color: var(--font-color);
      }
    }
  }
}
</style>
