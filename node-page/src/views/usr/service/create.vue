<template>
  <div class="form">
    <div class="wrap">
      <h2>Create Service</h2>
      <el-form>
        <el-form-item label="Service Name" required>
          <I18nInput/>
        </el-form-item>
        <el-form-item label="Service Type" required>
          <ServiceTypeSelect/>
        </el-form-item>
        <el-form-item label="Factory" required>
          <SpaceSelect/>
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
  </div>
</template>

<script>
import I18nInput from "../../../components/common/I18nInput.vue";
import SpaceSelect from "../../../components/space/SpaceSelect.vue";
import CompilerSelect from "../../../components/common/CompilerSelect.vue";
import ServiceTypeSelect from "../../../components/service/ServiceTypeSelect.vue";
import DatabaseSelect from "../../../components/database/DatabaseSelect.vue";

export default {
  components: {DatabaseSelect, ServiceTypeSelect, CompilerSelect, SpaceSelect, I18nInput}
}
</script>

<style scoped lang="scss">
.form {
  height: 100%;
  overflow-y: auto;
  .wrap {
    width: 500px;
    background-color: #fff;
    margin: 30px auto 60px auto;
    box-shadow: var(--form-shadow);
    padding-bottom: 30px;
  }
  // 标题
  h2 {
    text-align: center;
    padding: 30px 0;
  }
  // 表单
  .el-form {
    padding: 0 30px;
  }
  // 操作
  .opera {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
