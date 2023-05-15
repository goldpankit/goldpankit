<template>
  <div class="form">
    <div class="wrap">
      <h2>Create Service</h2>
      <section class="tip" v-if="space != null">
        Create Service for <em>{{space.name}}</em>.
      </section>
      <el-form>
        <el-form-item label="Service Name" required>
          <I18nInput/>
        </el-form-item>
        <el-form-item label="Service Type" required>
          <ServiceTypeSelect/>
        </el-form-item>
<!--        <el-form-item label="Factory" required>-->
<!--          <SpaceSelect/>-->
<!--        </el-form-item>-->
        <el-form-item label="Default Compiler" required>
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
        <el-button type="primary" @click="$router.push({ name: 'ServiceSettings' })">Create Service</el-button>
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
import { fetchById } from "../../../api/service.space";

export default {
  components: {DatabaseSelect, ServiceTypeSelect, CompilerSelect, SpaceSelect, I18nInput},
  data () {
    return {
      spaceId: null,
      space: null
    }
  },
  methods: {
    fetchSpaceById() {
      fetchById(this.spaceId)
        .then(data => {
          this.space = data
        })
        .catch(e => {
          console.log('e', e)
        })
    }
  },
  created () {
    this.spaceId = this.$route.query.space_id
    this.fetchSpaceById()
  }
}
</script>

<style scoped lang="scss">
.form {
  height: 100%;
  overflow-y: auto;
  .wrap {
    width: 500px;
    background-color: #fff;
    margin: 30px auto var(--gap-page-bottom) auto;
    box-shadow: var(--form-shadow);
    padding-bottom: 30px;
  }
  // 标题
  h2 {
    text-align: center;
    padding: 30px 0;
  }
  // 提示
  .tip {
    padding: 20px;
    background: var(--primary-color-match-2);
    color: #fff;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    em {
      background: rgba(0, 0, 0, .15);
      padding: 3px 5px;
      border-radius: 5px;
      font-style: normal;
      font-weight: bold;
      margin: 0 5px;
    }
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
