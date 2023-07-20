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
          <DatabaseTypeSelect v-model="form.supportedDatabases" @change="saveConfig"/>
        </el-form-item>
        <el-form-item label="Charge" prop="prices[0].type" required>
          <el-radio-group v-model="form.prices[0].type" @change="changePriceType">
            <el-radio-button label="free">Free</el-radio-button>
            <el-radio-button label="times">Charge per ride</el-radio-button>
            <el-radio-button label="monthly">Monthly charge</el-radio-button>
            <el-radio-button label="quarterly">Quarterly charge</el-radio-button>
            <el-radio-button label="annual">Annual charge</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.prices[0].type !== 'free'" label="Price" prop="prices[0].value" class="item-price" required>
          <span><img src="/public/images/bean.png"></span>
          <el-input-number :controls="false" v-model="form.prices[0].value" @input="saveConfig"/>
        </el-form-item>
        <el-form-item label="Other settings" class="item-other-settings">
          <div>
            <el-checkbox v-model="form.private" @change="saveConfig"/>
            <p>Is a private service.</p>
          </div>
          <div v-if="serviceType === 'MAIN'">
            <el-checkbox v-model="form.receivable" @change="saveConfig"/>
            <p>Receive sub services added by others.</p>
          </div>
        </el-form-item>
        <el-form-item label="Translator" prop="translator">
          <TranslatorList :space="space" :service="service" :translator="form.translator" @save="saveConfig"/>
        </el-form-item>
        <el-form-item label="Install Builds" prop="builds">
          <BuildList :builds="form.builds" :service-config="serviceConfig" @save="saveConfig"/>
        </el-form-item>
        <el-form-item label="Uninstall Builds" prop="unbuilds">
          <BuildList :builds="form.unbuilds" :with-unbuild="true" :service-config="serviceConfig" @save="saveConfig"/>
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
import DatabaseTypeSelect from "../../database/DatabaseTypeSelect.vue";
import DirectorySelect from "../../common/DirectorySelect.vue";
import BuildList from "../build/BuildList.vue";
import TranslatorList from "../translator/TranslatorList.vue";
import {fetchConfig, initialize, saveConfig} from "../../../api/service";

export default {
  name: "BasicSetting",
  components: {TranslatorList, BuildList, DirectorySelect, DatabaseTypeSelect, CompilerSelect},
  props: {
    space: {
      required: true
    },
    service: {
      required: true
    },
    serviceType: {
      required: true
    },
    serviceConfig: {}
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
        private: false,
        receivable: false,
        compiler: '',
        supportedDatabases: [],
        tableFieldDefinitions: [],
        builds: [],
        unbuilds: [],
        prices: [
          {
            type: 'free',
            value: 0,
          }
        ],
        translator: {
          output: '',
          settings: []
        },
        codespace: ''
      }
    }
  },
  methods: {
    // 初始化数据
    initData () {
      for (const key in this.form) {
        this.form[key] = this.serviceConfig[key] || this.form[key]
      }
      this.originForm = JSON.parse(JSON.stringify(this.form))
    },
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
    // 切换价格类型
    changePriceType (value) {
      if (value === 'free') {
        this.form.prices[0].value = 0
      }
      this.saveConfig()
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
            this.form.prices = config.prices || this.form.prices
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
            content: item.contentType === 'file' ? item.__filepath : item.content,
            contentType: item.contentType
          }
        }),
        unbuilds: this.form.unbuilds.map(item => {
          return {
            name: item.name,
            type: item.type,
            content: item.contentType === 'file' ? item.__filepath : item.content,
            contentType: item.contentType
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
    this.initData()
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
      .item-price {
        display: flex;
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
      .item-other-settings {
        .el-form-item__content {
          flex-direction: column;
          align-items: flex-start;
          & > div {
            display: flex;
            .el-checkbox {
              margin-right: 10px;
            }
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
