<template>
  <div class="form">
    <h2>Create Factory</h2>
    <el-form>
      <el-form-item label="Factory Name" required>
        <el-input/>
      </el-form-item>
      <el-form-item label="Factory Name" required>
        <i18n-input/>
      </el-form-item>
    </el-form>
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
  height: 600px;
  background-color: #fff;
  margin: 30px auto 0 auto;
  h2 {
    text-align: center;
    padding: 30px 0;
  }
  .el-form {
    padding: 0 30px;
  }
}
</style>
