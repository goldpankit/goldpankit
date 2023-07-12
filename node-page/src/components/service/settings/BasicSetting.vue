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
        <el-form-item label="Charge" prop="chargeValue" required>
          <el-radio-group v-model="form.chargeType">
            <el-radio label="free">Free</el-radio>
            <el-radio label="times">Charge per ride</el-radio>
            <el-radio label="month">Monthly charge</el-radio>
            <el-radio label="quarter">Quarterly charge</el-radio>
            <el-radio label="year">Annual charge</el-radio>
          </el-radio-group>
          <div v-if="form.chargeType !== 'free'" class="charge-value">
            <span><img src="/public/images/bean.png"></span>
            <el-input-number :controls="false" v-model="form.chargeValue"/>
          </div>
        </el-form-item>
        <el-form-item label="Translator" prop="translator">
          <TranslatorList :space="space" :service="service" :translator="form.translator" @save="saveConfig"/>
        </el-form-item>
        <el-form-item label="Install Builds" prop="builds">
          <BuildList :builds="form.builds" @save="saveConfig"/>
        </el-form-item>
        <el-form-item label="Uninstall Builds" prop="builds">
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
import BuildList from "../build/BuildList.vue";
import TranslatorList from "../translator/TranslatorList.vue";
import {fetchConfig, initialize, saveConfig} from "../../../api/service";

export default {
  name: "BasicSetting",
  components: {TranslatorList, BuildList, DirectorySelect, DatabaseSelect, CompilerSelect},
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
        tableFieldDefinitions: [],
        builds: [],
        unbuilds: [],
        chargeType: 'free',
        chargeValue: 0,
        translator: {
          output: '',
          settings: []
        },
        codespace: ''
      }
    }
  },
  methods: {
    // 初始化
    initialize () {
      initialize(this.form)
        .then(() => {
          this.newCodespace.changing = false
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
            this.form.unbuilds = config.unbuilds || this.form.unbuilds
            this.form.translator = config.translator || this.form.translator
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
        translator: {
          ...this.form.translator,
          settings: this.form.translator.settings
            .filter(t => (t.type === 'code' && t.code.trim().length > 0) ||
              (t.type === 'pattern' && t.source.trim() !== '' && t.target.trim() !== ''))
            .map(t => {
              return {
                name: t.name,
                path: t.path.trim().length === 0 ? '.*' : t.path,
                type: t.type,
                source: t.type === 'pattern' ? t.source : '',
                target: t.type === 'pattern' ? t.target : '',
                code: t.type === 'code' ? t.code : ''
              }
            })
        },
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
        this.form.unbuilds = config.unbuilds || []
        this.form.codespace = config.codespace
        this.form.translator = config.translator
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
      .charge-value {
        display: flex;
        align-items: center;
        span {
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 20px;
            height: auto;
            margin-right: 5px;
          }
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
