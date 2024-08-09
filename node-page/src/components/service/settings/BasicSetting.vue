<template>
  <div class="basic-setting">
    <div class="wrap">
      <el-form :model="form">
        <!-- 服务标识符/名称 -->
        <template v-if="plugin == null">
          <el-form-item :label="$t('service.settings.name')" prop="version" required>
            <el-input v-model="form.name" disabled/>
          </el-form-item>
          <el-form-item :label="$t('service.settings.label')" prop="version" required>
            <el-input v-model="form.label" @input="saveConfig"/>
          </el-form-item>
        </template>
        <!-- 插件标识符/名称 -->
        <template v-else>
          <el-form-item :label="$t('plugin.name')" prop="version" required>
            <el-input v-model="form.name" disabled/>
          </el-form-item>
          <el-form-item :label="$t('plugin.label')" prop="version" required>
            <el-input v-model="form.label" @input="saveConfig"/>
          </el-form-item>
        </template>
        <el-form-item :label="$t('service.settings.version')" prop="version" required>
          <el-input v-model="form.version" @input="saveConfig"/>
          <FormItemTip content="如1.0.0.0，其中最后一个版本号不触发升级提醒！"/>
        </el-form-item>
        <el-form-item v-if="isPlugin" label="最低兼容的服务版本号" prop="minServiceVersion">
          <el-input v-model="form.minServiceVersion" @input="saveConfig"/>
        </el-form-item>
        <el-form-item :label="$t('service.settings.compiler')" prop="compiler" required>
          <CompilerSelect v-model="form.compiler" @change="saveConfig"/>
        </el-form-item>
        <el-form-item :label="$t('service.settings.supportedDatabases')" prop="supportedDatabases">
          <DatabaseTypeSelect v-model="form.supportedDatabases" @change="saveConfig"/>
        </el-form-item>
        <el-form-item :label="$t('service.settings.repository')" prop="repository">
          <div class="repository-input-wrap">
            <el-input class="repository-input" v-model="form.repository" @input="saveConfig"/>
            <span>/</span>
            <el-input
              class="branch-input"
              v-model="form.branch"
              :placeholder="$t('gitClone.branch')"
              @input="handleBranchInput"
            />
            <el-button
              type="primary"
              :disabled="isWorking.clone || !clonable"
              :loading="isWorking.clone"
              @click="clone"
            >{{$t('gitClone.clone')}}</el-button>
          </div>
        </el-form-item>
        <el-form-item :label="$t('service.settings.introduce')" prop="introduce" required>
          <el-input type="textarea" :rows="5" v-model="form.introduce" @input="saveConfig"/>
        </el-form-item>
        <el-form-item label="预置插件" prop="presetPlugins" required>
          <PluginSelector v-model="form.presetPlugins" :space="space" :service="service" major-version="v4" @change="saveConfig"/>
          <FormItemTip content="预置插件会在安装服务时自动安装！"/>
        </el-form-item>
<!--        <el-form-item :label="$t('service.settings.charge')" prop="prices[0].type" required>-->
<!--          <el-radio-group v-model="form.prices[0].type" @change="changePriceType">-->
<!--            <el-radio-button-->
<!--              v-for="option in $const.getServiceLeaseTypes($t)"-->
<!--              :key="option.code"-->
<!--              :label="option.code"-->
<!--            >{{option.label}}</el-radio-button>-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->
<!--        <el-form-item v-if="form.prices[0].type !== 'free'" label="Price" prop="prices[0].value" class="item-price" required>-->
<!--          <span><img src="/public/images/bean.png"></span>-->
<!--          <el-input-number :controls="false" v-model="form.prices[0].value" @input="saveConfig"/>-->
<!--        </el-form-item>-->
        <el-form-item :label="$t('service.settings.otherSettings')" class="item-other-settings">
          <div>
            <el-checkbox v-model="form.private" label="私有" @change="saveConfig"/>
          </div>
        </el-form-item>
        <el-form-item :label="$t('service.settings.translator.translator')" prop="translator">
          <Translator :data="form.translator" @save="saveConfig"/>
        </el-form-item>
        <el-form-item :label="$t('service.settings.installBuilds')" prop="builds">
          <BuildList :builds="form.builds" :service-config="serviceConfig" @save="saveConfig"/>
        </el-form-item>
        <el-form-item :label="$t('service.settings.uninstallBuilds')" prop="unbuilds">
          <BuildList :builds="form.unbuilds" :with-unbuild="true" :service-config="serviceConfig" @save="saveConfig"/>
        </el-form-item>
        <el-form-item :label="$t('service.settings.codespace')" prop="codespace">
          <div v-if="!newCodespace.changing" class="codespace-wrap">
            <p>{{form.codespace}}</p>
            <el-button type="primary" @click="changeCodespace">{{$t('service.settings.changeCodespace')}}</el-button>
          </div>
          <DirectorySelect
            v-else
            :title="$t('service.settings.selectNewCodespace')"
            v-model="newCodespace.value"
            @change="fetchConfig"
          />
        </el-form-item>
      </el-form>
      <div v-if="newCodespace.changing" class="opera-wrap">
        <el-button @click="newCodespace.changing=false">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="initialize">{{$t('service.settings.reinitialize')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import CompilerSelect from '@/components/common/CompilerSelect'
import DatabaseTypeSelect from '@/components/database/DatabaseTypeSelect'
import DirectorySelect from '@/components/common/DirectorySelect'
import BuildList from '@/components/service/build/BuildList'
import PluginSelector from '@/components/service/PluginSelector'
import {
  fetchConfig as fetchServiceConfig,
  initialize as initService,
  saveConfig as saveServiceConfig
} from '@/api/service'
import {
  fetchConfig as fetchPluginConfig,
  initialize as initPlugin,
  saveConfig as savePluginConfig
} from '@/api/plugin'
import { gitClone } from '@/api/service'
import { checkVersionNumber } from '@/utils/form.check'
import FormItemTip from '@/components/common/FormItemTip'
import Translator from '@/components/service/translator/Translator'

export default {
  name: "BasicSetting",
  components: {Translator, FormItemTip, BuildList, DirectorySelect, DatabaseTypeSelect, CompilerSelect, PluginSelector},
  props: {
    space: {
      required: true
    },
    service: {
      required: true
    },
    plugin: {
      required: false
    },
    serviceConfig: {}
  },
  data () {
    return {
      isWorking: {
        clone: false
      },
      newCodespace: {
        changing: false,
        value: ''
      },
      // 原始form内容
      originForm: null,
      form: {
        name: '',
        label: '',
        version: '',
        minServiceVersion: '',
        private: false,
        receivable: false,
        compiler: '',
        introduce: '',
        presetPlugins: [],
        // 仓库地址
        repository: '',
        // 仓库标签
        branch: '',
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
  computed: {
    // 是否为插件
    isPlugin () {
      return this.plugin != null
    },
    // 是否可克隆
    clonable () {
      return this.form.repository.trim() !== '' && this.form.branch.trim() !== ''
    }
  },
  methods: {
    // 初始化数据
    initData () {
      for (const key in this.form) {
        // 兼容label和name（1.3.0）
        if (key === 'label') {
          this.form.label = this.serviceConfig.label || this.serviceConfig.name || this.form.label
        }
        this.form[key] = this.serviceConfig[key] || this.form[key]
      }
      /*
      处理翻译器（翻译器在2.9.6由 translator: { output: '', settings: [翻译器列表] }
      改为 translator: { output: '', filepath: '路径翻译代码', content: '内容翻译代码' }，
      此处兼容2.9.6之前缺少filepath和content属性的情况
      */
      if (this.form.translator != null) {
        this.form.translator.filepath = this.form.translator.filepath || ''
        this.form.translator.content = this.form.translator.content || ''
        if (this.form.translator.settings) {
          delete this.form.translator.settings
        }
      }
      /*
       2.11.0增加插件预置presetPlugins列表
      */
      if (this.form.presetPlugins === undefined) {
        this.form.presetPlugins = []
      }
      this.originForm = JSON.parse(JSON.stringify(this.form))
    },
    // 初始化
    initialize () {
      this.form.codespace = this.newCodespace.value
      let promise
      if (this.isPlugin) {
        promise = initPlugin({
          space: this.space,
          service: this.service,
          name: this.plugin,
          ...this.form
        })
      } else {
        promise = initService({
          space: this.space,
          name: this.service,
          ...this.form
        })
      }
      promise
        .then(() => {
          this.newCodespace.changing = false
          this.$emit('initialized', this.form)
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 处理分支输入
    handleBranchInput (value) {
      if (value.startsWith('v') || value.startsWith('V')) {
        value = value.substring(1)
      }
      checkVersionNumber(null, value, (err) => {
        if (!err) {
          this.form.version = value
        }
        this.saveConfig()
      })
    },
    // 克隆仓库
    clone () {
      if (this.isWorking.clone) {
        return
      }
      this.alert(
        this.$t('gitClone.cloneTip'),
        this.$t('common.importantTip'),
        {
          showCancelButton: true,
          cancelButtonText: this.$t('common.cancel'),
          confirmButtonText: this.$t('gitClone.confirm'),
          confirmButtonClass: 'danger-button'
        }
      )
        .then(() => {
          this.isWorking.clone = true
          gitClone({
            space: this.space,
            service: this.service,
            plugin: this.plugin
          })
            .then(() => {
              this.alert(this.$t('gitClone.cloneSuccess'))
                .then(() => {
                  window.location.reload()
                  // this.$emit('clone-success')
                })
                .catch(() => {})
            })
            .catch(e => {
              this.alert(this.$t('gitClone.cloneFailed', {message: e.message}), this.$t('gitClone.cloneFailedTitle')).catch(() => {})
            })
            .finally(() => {
              this.isWorking.clone = false
            })
        })
        .catch(() => {})
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
      let promise
      // 获取插件配置
      if (this.isPlugin) {
        promise = fetchPluginConfig({codespace})
      }
      // 获取服务配置
      else {
        promise = fetchServiceConfig({codespace})
      }
      promise
        .then(config => {
          if (config != null) {
            // 兼容label和name（1.3.0）
            this.form.name = config.name || this.form.name
            this.form.label = config.label || config.name || this.form.label
            this.form.version = config.version || this.form.version
            this.form.minServiceVersion = config.minServiceVersion || this.form.minServiceVersion
            this.form.introduce = config.introduce || this.form.introduce
            this.form.compiler = config.compiler || this.form.compiler
            this.form.prices = config.prices || this.form.prices
            this.form.supportedDatabases = config.supportedDatabases || this.form.supportedDatabases
            this.form.builds = config.builds || this.form.builds
            this.form.unbuilds = config.unbuilds || this.form.unbuilds
            this.form.translator = config.translator || this.form.translator
          }
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 保存配置
    saveConfig () {
      // 修改codespace时不要自动保存配置
      if (this.newCodespace.changing) {
        return
      }
      let unique,saveConfig
      // 保存插件配置
      if (this.isPlugin) {
        saveConfig = savePluginConfig
        unique = {
          space: this.space,
          service: this.service,
          plugin: this.plugin
        }
      }
      // 保存服务配置
      else {
        saveConfig = saveServiceConfig
        unique = {
          space: this.space,
          service: this.service
        }
        // 服务没有最小版本
        delete this.form.minServiceVersion
      }
      // 保存配置
      saveConfig({
        ...unique,
        ...this.form,
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
          this.$tip.apiFailed(e)
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
    width: 750px;
    margin: 0 auto;
    padding: 30px 0;
    :deep(.el-form) {
      .el-form-item__label {
        font-weight: bold;
      }
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
        }
      }
      // 代码仓库
      .repository-input-wrap {
        width: 100%;
        display: flex;
        & > span {
          flex-shrink: 0;
          margin: 0 5px;
        }
        .branch-input {
          flex-shrink: 0;
          width: 95px;
        }
        .repository-input {
          flex-shrink: initial;
          flex-grow: 1;
        }
        .el-button {
          flex-shrink: 0;
          margin-left: 10px;
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
