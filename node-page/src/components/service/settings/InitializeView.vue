<template>
  <div class="initialize-wrap">
    <div class="tip">
      <h3>Initialize Service</h3>
      <p>You must first specify or create a local directory and initialize the service. Then you can code the service in the specified local directory.</p>
    </div>
    <el-form :model="form">
      <el-form-item label="Version" prop="version" required>
        <el-input v-model="form.version"/>
      </el-form-item>
      <el-form-item label="Compiler" prop="compiler" required>
        <CompilerSelect v-model="form.compiler"/>
      </el-form-item>
      <el-form-item label="Supported Databases" prop="supportedDatabases">
        <DatabaseSelect v-model="form.supportedDatabases"/>
      </el-form-item>
    </el-form>
    <div class="directory-select-wrap">
      <DirectorySelect
        v-model="form.codespace"
        title="Select Service Directory"
        @change="fetchConfig"
      />
    </div>
    <div class="opera-bottom">
      <el-button type="primary" size="large" @click="initialize">Initialize Service</el-button>
    </div>
  </div>
</template>

<script>
import DirectorySelect from "../../common/DirectorySelect.vue";
import CompilerSelect from "../../common/CompilerSelect.vue";
import DatabaseSelect from "../../database/DatabaseSelect.vue";
import {fetchConfig, initialize} from "../../../api/service";

export default {
  name: "InitializeView",
  components: {DatabaseSelect, CompilerSelect, DirectorySelect},
  props: {
    spaceName: {
      required: true
    },
    serviceName: {
      required: true
    }
  },
  data () {
    return {
      form: {
        space: this.spaceName,
        name: this.serviceName,
        version: 'v1.0.0',
        compiler: 'static',
        supportedDatabases: [],
        codespace: ''
      }
    }
  },
  methods: {
    // 初始化
    initialize () {
      initialize(this.form)
        .then(() => {
          this.service.initialized = true
        })
        .catch(e => {
          console.log('e', e)
        })
    },
    // 获取配置
    fetchConfig (codespace) {
      fetchConfig({
        codespace
      })
        .then(config => {
          if (config != null) {
            this.form.version = config.version || this.form.version
            this.form.compiler = config.compiler || this.form.compiler
            this.form.supportedDatabases = config.supportedDatabases || this.form.supportedDatabases
          }
        })
        .catch(e => {
          console.log('e', e)
        })
    }
  }
}
</script>

<style scoped lang="scss">
// 初始化
.initialize-wrap {
  width: 650px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding-top: var(--gap-page-bottom);
  .tip {
    text-align: center;
    h3 {
      margin-bottom: 20px;
      font-size: var(--font-size-large);
    }
    p {
      font-size: var(--font-size-middle);
      line-height: 1.5;
    }
  }
  .directory-select-wrap {
    margin-top: 20px;
  }
  .opera-bottom {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    .el-button {
      font-size: var(--font-size-middle);
    }
  }
}
</style>
