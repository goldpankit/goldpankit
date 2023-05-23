<template>
  <div class="form">
    <div class="wrap">
      <h2>Create Service</h2>
      <section class="tip" v-if="space != null">
        Create Service for <em>{{space.name}}</em>.
      </section>
      <el-form>
        <el-form-item label="Service Name" required>
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="Service Type" required>
          <ServiceTypeSelect v-model="form.type"/>
        </el-form-item>
        <el-form-item v-if="form.type === 'framework'" label="Version" required>
          <VersionSelect v-model="form.version"/>
        </el-form-item>
        <template v-else>
          <el-form-item label="Follow Framework Service" required>
            <FrameworkServiceSelect v-model="form.followServiceId" :space-name="spaceName" />
          </el-form-item>
          <el-form-item label="Follow Framework Version" required>
            <VersionSelect v-model="form.version"/>
          </el-form-item>
        </template>
        <el-form-item label="Default Compiler" required>
          <CompilerSelect v-model="form.compiler"/>
        </el-form-item>
        <el-form-item label="Supported Databases">
          <DatabaseSelect v-model="form.supportedDatabases"/>
        </el-form-item>
        <el-form-item label="Repository">
          <el-input v-model="form.repository"/>
        </el-form-item>
        <el-form-item label="Introduce" required>
          <I18nInput type="textarea" v-model="form.description"/>
        </el-form-item>
      </el-form>
      <div class="opera">
        <el-button type="primary" size="large" @click="create">Create Service</el-button>
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
import VersionSelect from "../../../components/common/VersionSelect.vue";
import { fetchByName } from "../../../api/service.space";
import { create } from "../../../api/service";
import FrameworkServiceSelect from "../../../components/service/FrameworkServiceSelect.vue";

export default {
  components: {
    FrameworkServiceSelect,
    VersionSelect, DatabaseSelect, ServiceTypeSelect, CompilerSelect, SpaceSelect, I18nInput},
  data () {
    return {
      spaceName: null,
      space: null,
      form: {
        followServiceId: null,
        name: '',
        type: 'framework',
        version: 'v1',
        compiler: 'static',
        supportedDatabases: [],
        description: ''
      }
    }
  },
  methods: {
    // 创建服务
    create () {
      create({
        spaceId: this.space.id,
        ...this.form
      })
        .then(data => {
          this.$router.push({ name: 'ServiceSettings', query: { service_id: data } })
        })
        .catch(e => {
          console.log('e', e)
        })
    },
    // 查询服务空间
    fetchSpace() {
      fetchByName(this.spaceName)
        .then(data => {
          this.space = data
        })
        .catch(e => {
          console.log('e', e)
        })
    }
  },
  created () {
    this.spaceName = this.$route.query.space_name
    this.fetchSpace()
  }
}
</script>

<style scoped lang="scss">
.form {
  height: 100%;
  overflow-y: auto;
  .wrap {
    width: 500px;
    background-color: var(--color-light);
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
    color: var(--color-light);
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
