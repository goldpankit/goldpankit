<template>
  <el-dialog
    v-model="visible"
    class="publish-window"
    :title="$t('service.settings.publishVersion')"
    width="500px"
    draggable
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" :rules="getRules()" v-loading="isWorking">
      <el-form-item :label="$t('service.versionNumber')" prop="version" required>
        <el-input v-model="form.version" @input="saveConfig">
          <template #prefix>v</template>
        </el-input>
        <FormItemTip content="如1.0.0.0，其中最后一个版本号不触发升级提醒！"/>
      </el-form-item>
      <el-form-item :label="$t('service.versionDescription')" prop="publishDescription" required>
        <el-input type="textarea" :rows="5" v-model="form.publishDescription" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button :disabled="isWorking" @click="visible = false">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" :disabled="isWorking" @click="publish">
          {{$t('service.settings.publish')}}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {publish} from "@/api/service.version";
import {checkVersionNumber} from "@/utils/form.check";
import {
  fetchConfig as fetchServiceConfig,
  saveConfig as saveServiceConfig
} from "@/api/service";
import {
  fetchConfig as fetchPluginConfig,
  saveConfig as savePluginConfig
} from "@/api/plugin";
import FormItemTip from "@/components/common/FormItemTip.vue";

export default {
  name: "PublishWindow",
  components: {FormItemTip},
  data () {
    return {
      visible: false,
      isWorking: false,
      space: null,
      service: null,
      plugin: null,
      form: {
        version: '',
        publishDescription: ''
      }
    }
  },
  computed: {
    isPlugin () {
      return this.plugin != null
    },
    unique () {
      if (this.isPlugin) {
        return {
          space: this.space,
          service: this.service,
          plugin: this.plugin
        }
      }
      return {
        space: this.space,
        service: this.service
      }
    },
    fetchConfigApi () {
      if (this.isPlugin) {
        return fetchServiceConfig
      }
      return fetchPluginConfig
    },
    saveConfigApi () {
      if (this.isPlugin) {
        return savePluginConfig
      }
      return saveServiceConfig
    }
  },
  methods: {
    open (space, service, plugin) {
      this.space = space
      this.service = service
      this.plugin = plugin
      this.visible = true
      this.fetchConfig()
    },
    getRules () {
      return {
        version: [
          { required: true, message: this.$t('form.isRequired', { value: this.$t('service.versionNumber') })},
          { validator: checkVersionNumber, message: this.$t('form.isIncorrect', { field: this.$t('service.versionNumber') }) }
        ],
        publishDescription: [
          { required: true, message: this.$t('form.isRequired', { value: this.$t('service.versionDescription') })}
        ]
      }
    },
    // 获取版本配置
    fetchConfig () {
      this.fetchConfigApi(this.unique)
        .then(config => {
          this.form.version = config.version
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 保存配置
    saveConfig () {
        this.saveConfigApi({
          ...this.unique,
          version: this.form.version
        })
          .catch(e => {
            this.$tip.apiFailed(e)
          })
    },
    // 发布
    publish () {
      this.$refs.form.validate().then(() => {
        if (this.isWorking) {
          return
        }
        this.isWorking = true
        publish({
          ...this.unique,
          publishDescription: this.form.publishDescription
        })
          .then(() => {
            this.visible = false
            this.$message.success('发布成功')
          })
          .catch(e => {
            this.$tip.apiFailed(e)
          })
          .finally(() => {
            this.isWorking = false
          })
      })
    }
  }
}
</script>

<style lang="scss">
</style>
