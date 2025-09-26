<template>
  <el-dialog
    v-model="visible"
    class="publish-window"
    :title="$t('service.settings.publishVersion')"
    width="950px"
    draggable
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" :rules="getRules()" v-loading="isWorking">
      <el-form-item :label="labelText" prop="label" required>
        <el-input v-model="form.label" @input="saveConfig"/>
      </el-form-item>
      <el-form-item label="版本号" prop="version" required>
        <el-input v-model="form.version" @input="saveConfig">
          <template #prefix>v</template>
        </el-input>
        <FormItemTip content="如1.0.0.0，其中最后一个版本号不触发升级提醒！"/>
      </el-form-item>
      <el-form-item label="版本描述" prop="publishDescription" required>
        <el-input type="textarea" :rows="5" v-model="form.publishDescription" />
      </el-form-item>
      <el-form-item v-if="isPlugin" label="同时发布到其它框架" prop="syncPlugins">
        <SyncPluginsSetting :sync-plugins="form.syncPlugins" @change="saveConfig">
          <el-table-column label="发布结果">
            <template #default="{ row }">
              <span v-if="row._publish_status === 'pending'" class="text-info-1">发布中...</span>
              <span v-else-if="row._publish_status === 'success'" class="text-success">发布成功</span>
              <span v-else class="text-danger">{{ row._publish_message }}</span>
            </template>
          </el-table-column>
        </SyncPluginsSetting>
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
import FormItemTip from '@/components/common/FormItemTip'
import SyncPluginsSetting from '@/components/service/settings/SyncPluginsSetting'
import { publish } from '@/api/service.version'
import { checkVersionNumber } from '@/utils/form.check'
import {
  fetchConfig as fetchServiceConfig,
  saveConfig as saveServiceConfig
} from "@/api/service";
import {
  fetchConfig as fetchPluginConfig,
  saveConfig as savePluginConfig
} from "@/api/plugin";


export default {
  name: "PublishWindow",
  components: { SyncPluginsSetting, FormItemTip },
  data () {
    return {
      visible: false,
      isWorking: false,
      space: null,
      service: null,
      plugin: null,
      // 服务配置
      config: null,
      form: {
        label: '',
        version: '',
        publishDescription: '',
        syncPlugins: []
      }
    }
  },
  computed: {
    isPlugin () {
      return this.plugin != null
    },
    labelText () {
      if (this.isPlugin) {
        return '插件名称'
      }
      return '框架名称'
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
        label: [
          { required: true, message: this.isPlugin ? '请输入插件名称' : '请输入框架名称' },
        ],
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
          this.config = config
          this.form.label = config.label
          this.form.version = config.version
          this.form.syncPlugins = config.syncPlugins || []
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 保存配置
    saveConfig () {
      this.saveConfigApi({
        ...this.unique,
        label: this.form.label,
        version: this.form.version,
        syncPlugins: this.form.syncPlugins.map(item => {
          // 去掉_publish_status, _publish_message等虚拟字段
          const pluginInfo = {}
          for (const key in item) {
            if (key.startsWith('_')) {
              continue
            }
            pluginInfo[key] = item[key]
          }
          return pluginInfo
        })
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
        // 发布当前服务
        publish({
          space: this.space,
          service: this.service,
          plugin: this.plugin,
          // 具体发布的服务信息
          publishSpace: this.space,
          publishService: this.service,
          publishVersion: this.form.version,
          publishMinServiceVersion: this.config.minServiceVersion,
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
        // 同步发布插件
        if (this.isPlugin && this.form.syncPlugins.length > 0) {
          this.form.syncPlugins.forEach(pluginLine => {
            pluginLine._publish_status = 'pending'
            // 信息不全的插件行，不做发布
            if (pluginLine.space.trim() === ''
              && pluginLine.service.trim() === ''
              && pluginLine.version.trim() === '') {
              pluginLine._publish_status = null
              return
            }
            if (pluginLine.space.trim() === ''
              || pluginLine.service.trim() === ''
              || pluginLine.version.trim() === '') {
              pluginLine._publish_status = 'error'
              pluginLine._publish_message = '插件信息不全，已忽略'
              return
            }
            publish({
              space: this.space,
              service: this.service,
              plugin: this.plugin,
              // 具体发布的服务信息
              publishSpace: pluginLine.space,
              publishService: pluginLine.service,
              publishVersion: pluginLine.version,
              publishMinServiceVersion: pluginLine.minServiceVersion,
              publishDescription: this.form.publishDescription
            })
              .then(() => {
                pluginLine._publish_status = 'success'
              })
              .catch(e => {
                pluginLine._publish_status = 'error'
                pluginLine._publish_message = e.message
              })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
</style>
