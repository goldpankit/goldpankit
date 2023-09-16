<template>
  <div class="initialize-wrap">
    <div class="tip">
      <h3>{{$t('service.settings.initialize.initializeService')}}</h3>
      <p>{{$t('service.settings.initialize.initializeServiceTip')}}</p>
    </div>
    <div class="directory-select-wrap">
      <DirectorySelect
        v-model="form.codespace"
        :title="$t('service.settings.initialize.selectServiceCodespace')"
        @change="fetchConfig"
      />
    </div>
    <div class="opera-bottom">
      <el-button type="primary" size="large" @click="initialize">{{$t('service.settings.initialize.initializeService')}}</el-button>
    </div>
  </div>
</template>

<script>
import DirectorySelect from "@/components/common/DirectorySelect.vue";
import CompilerSelect from "@/components/common/CompilerSelect.vue";
import DatabaseTypeSelect from "@/components/database/DatabaseTypeSelect.vue";
import {fetchConfig as fetchServiceConfig, initialize as initService} from "@/api/service";
import {fetchConfig as fetchPluginConfig, initialize as initPlugin} from "@/api/plugin";

export default {
  name: "InitializeView",
  components: {DatabaseTypeSelect, CompilerSelect, DirectorySelect},
  props: {
    spaceName: {
      required: true
    },
    serviceName: {
      required: true
    },
    serviceLabel: {
      required: false
    },
    pluginName: {
      required: false
    },
    pluginLabel: {
      required: false
    }
  },
  data () {
    return {
      form: {
        space: this.spaceName,
        name: null,
        version: '1.0.0',
        compiler: 'static',
        supportedDatabases: [],
        codespace: ''
      }
    }
  },
  computed: {
    // 是否为初始化插件
    isInitPlugin () {
      return this.pluginName != null
    }
  },
  methods: {
    // 初始化
    initialize () {
      let promise
      // 初始化插件
      if (this.isInitPlugin) {
        promise = initPlugin({
          ...this.form,
          service: this.serviceName,
          name: this.pluginName,
          label: this.pluginLabel
        })
      }
      // 初始化服务
      else {
        promise = initService({
          ...this.form,
          name: this.serviceName,
          label: this.serviceLabel
        })
      }
      promise
        .then(() => {
          this.$emit('initialized', this.form)
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 获取配置
    fetchConfig (codespace) {
      let promise
      // 获取插件配置
      if (this.isInitPlugin) {
        promise = fetchPluginConfig({codespace})
      }
      // 获取服务配置
      else {
        promise = fetchServiceConfig({codespace})
      }
      promise
        .then(config => {
          if (config != null) {
            this.form.version = config.version || this.form.version
            this.form.compiler = config.compiler || this.form.compiler
            this.form.supportedDatabases = config.supportedDatabases || this.form.supportedDatabases
          }
        })
        .catch(e => {
          this.$tip.apiFailed(e)
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
    h3 {
      margin-bottom: 20px;
      font-size: var(--font-size-large);
    }
    p {
      line-height: 1.5;
      font-weight: bold;
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
