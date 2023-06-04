<template>
  <div class="basic-setting">
    <div class="wrap">
      <el-form :model="form">
        <el-form-item label="Version" prop="version" required>
          <el-input v-model="form.version" @input="saveConfig"/>
        </el-form-item>
        <el-form-item label="Compiler" prop="compiler" required>
          <CompilerSelect v-model="form.compiler" @change="saveConfig"/>
        </el-form-item>
        <el-form-item label="Supported Databases" prop="supportedDatabases">
          <DatabaseSelect v-model="form.supportedDatabases" @change="saveConfig"/>
        </el-form-item>
        <el-form-item label="Auto Build" prop="builds">
          <BuildList :builds="form.builds" @save="saveConfig"/>
        </el-form-item>
        <el-form-item label="Code Space" prop="codespace">
          <div v-if="!newCodespace.changing" class="codespace-wrap">
            <p>{{form.codespace}}</p>
            <el-button type="primary" @click="changeCodespace">Change</el-button>
          </div>
          <DirectorySelect
            v-else
            title="Select new codespace"
            v-model="newCodespace.value"
            @change="fetchConfig"
          />
        </el-form-item>
      </el-form>
      <div v-if="newCodespace.changing" class="opera-wrap">
        <el-button size="large" @click="newCodespace.changing=false">Cancel</el-button>
        <el-button size="large" type="primary" @click="initialize">Reinitialize</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import CompilerSelect from "../../common/CompilerSelect.vue";
import DatabaseSelect from "../../database/DatabaseSelect.vue";
import DirectorySelect from "../../common/DirectorySelect.vue";
import {fetchConfig, initialize, saveConfig} from "../../../api/service";
import BuildList from "../build/BuildList.vue";

export default {
  name: "BasicSetting",
  components: {BuildList, DirectorySelect, DatabaseSelect, CompilerSelect},
  props: {
    space: {
      required: true
    },
    service: {
      required: true
    }
  },
  data () {
    return {
      newCodespace: {
        changing: false,
        value: ''
      },
      // 原始form内容
      originForm: null,
      form: {
        version: '',
        compiler: '',
        supportedDatabases: [],
        builds: [],
        codespace: ''
      }
    }
  },
  methods: {
    // 初始化
    initialize () {
      initialize(this.form)
        .then(() => {
          this.$emit('initialized', this.form)
        })
        .catch(e => {
          console.log('e', e)
        })
    },
    // 修改代码空间
    changeCodespace () {
      this.newCodespace.changing = true
      this.newCodespace.value = this.form.codespace
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
            this.form.builds = config.builds || this.form.builds
          }
        })
        .catch(e => {
          console.log('e', e)
        })
    },
    // 保存配置
    saveConfig () {
      // 修改codespace时不要自动保存配置
      if (this.newCodespace.changing) {
        return
      }
      // 保存配置
      saveConfig({
        space: this.space,
        service: this.service,
        ...this.form,
        builds: this.form.builds.map(item => {
          return {
            name: item.name,
            type: item.type,
            content: item.content
          }
        })
      })
        .then(() => {
          this.originForm = JSON.parse(JSON.stringify(this.form))
        })
        .catch(e => {
          console.log('e', e)
        })
    }
  },
  created () {
    fetchConfig({
      space: this.space,
      service: this.service
    })
      .then(config => {
        // 需给定默认值，防止用户自行篡改配置文件
        this.form.version = config.version || '1.0.0'
        this.form.compiler = config.compiler || 'freemarker'
        this.form.supportedDatabases = config.supportedDatabases || []
        this.form.builds = config.builds || []
        this.form.codespace = config.codespace
        this.originForm = JSON.parse(JSON.stringify(this.form))
      })
      .catch(e => {
        console.log('e', e)
      })
  }
}
</script>

<style scoped lang="scss">
.basic-setting {
  .wrap {
    width: 650px;
    margin: 0 auto;
    padding: 30px 0;
    :deep(.el-form) {
      .codespace-wrap {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        p {
          word-break: break-all;
          line-height: initial;
        }
        .el-button {
          margin-left: 30px;
        }
      }
    }
    .opera-wrap {
      display: flex;
      justify-content: center;
      .el-button {
        width: 120px;
        margin-right: 30px;
        &:last-of-type {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
