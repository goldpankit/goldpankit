<template>
  <div class="form">
    <h2>Create Service</h2>
    <el-form>
      <el-form-item label="Service Name" required>
        <I18nInput/>
      </el-form-item>
      <el-form-item label="Service Type" required>
        <ServiceTypeSelect/>
      </el-form-item>
      <el-form-item label="Factory" required>
        <FactorySelect/>
      </el-form-item>
      <el-form-item label="Compiler" required>
        <CompilerSelect/>
      </el-form-item>
      <el-form-item label="Supported Databases" required>
        <DatabaseSelect/>
      </el-form-item>
      <el-form-item label="Introduce" required>
        <I18nInput type="textarea"/>
      </el-form-item>
    </el-form>
    <div class="opera">
      <el-button type="primary">Create Service</el-button>
    </div>
  </div>
</template>

<script>
import I18nInput from "../components/common/I18nInput.vue";
import FactorySelect from "../components/factory/FactorySelect.vue";
import CompilerSelect from "../components/common/CompilerSelect.vue";
import ServiceTypeSelect from "../components/service/ServiceTypeSelect.vue";
import DatabaseSelect from "../components/database/DatabaseSelect.vue";

export default {
  name: "create-factory",
  components: {DatabaseSelect, ServiceTypeSelect, CompilerSelect, FactorySelect, I18nInput}
}
</script>

<style scoped lang="scss">
.form {
  width: 500px;
  background-color: #fff;
  margin: 30px auto 60px auto;
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
