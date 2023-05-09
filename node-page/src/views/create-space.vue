<template>
  <div class="form">
    <h2>Create Space</h2>
    <el-form>
      <el-form-item label="Space Name" required>
        <el-input/>
      </el-form-item>
      <el-form-item label="Description" required>
        <i18n-input type="textarea"/>
      </el-form-item>
    </el-form>
    <div class="opera">
      <el-button type="primary">Create Space</el-button>
    </div>
  </div>
</template>

<script>
import I18nInput from "../components/common/I18nInput.vue";

export default {
  name: "create-factory",
  components: {I18nInput}
}
</script>

<style scoped lang="scss">
.form {
  width: 500px;
  background-color: #fff;
  margin: 30px auto 0 auto;
  padding-bottom: 30px;
  // 标题
  h2 {
    text-align: center;
    padding: 30px 0;
  }
  // 表单
  .el-form {
    padding: 0 30px;
    :deep(.el-form-item) {
      flex-direction: column;
      .el-form-item__label {
        justify-content: flex-start;
      }
    }
  }
  // 操作
  .opera {
    margin-top: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
