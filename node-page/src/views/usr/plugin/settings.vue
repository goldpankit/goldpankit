<template>
  <div class="page" :class="{ 'page-un-initialize': !initialized }" v-loading="loading" v-if="plugin != null">
    <div class="wrap">
      <div class="header-wrap">
        <div class="header">
          <h2>@{{plugin.space.name}}/{{plugin.service.name}}/{{plugin.name}}</h2>
          <div v-if="initialized" class="opera">
            <el-popover
              placement="top-start"
              :title="$t('service.settings.compileTipTitle')"
              :width="200"
              trigger="hover"
              :content="compileTip"
            >
              <template #reference>
                <el-button type="primary" :class="{ 'is-disabled': currentProject == null || isWorking.compile}" @click="compile">{{$t('service.settings.compile')}}</el-button>
              </template>
            </el-popover>
            <el-popover
                placement="top-start"
                :title="$t('service.settings.cleanCompileTipTitle')"
                :width="200"
                trigger="hover"
                :content="cleanCompileTip"
            >
              <template #reference>
                <el-button type="primary" :class="{ 'is-disabled': currentProject == null || isWorking.cleanCompile}" @click="cleanCompile">{{$t('service.settings.cleanCompile')}}</el-button>
              </template>
            </el-popover>
            <el-button type="important" @click="$refs.publishWindow.open(route.space, route.plugin)">{{$t('service.settings.publish')}}</el-button>
          </div>
        </div>
        <p
          v-if="initialized"
          class="text-info-1 service-path"
        >{{$t('service.settings.at')}} {{plugin.local.codespace}}</p>
      </div>
      <div class="main">
        <template v-if="initialized">
          <ul class="tabs">
            <li :class="{ selected: currentTab === 'basic' }" @click="currentTab = 'basic'">{{$t('service.settings.service')}}</li>
            <li :class="{ selected: currentTab === 'readme' }" @click="currentTab = 'readme'">{{$t('service.settings.readme')}}</li>
            <li :class="{ selected: currentTab === 'variables' }" @click="currentTab = 'variables'">{{$t('service.settings.variables')}}</li>
            <li :class="{ selected: currentTab === 'files' }" @click="currentTab = 'files'">{{$t('service.settings.files')}}</li>
            <li :class="{ selected: currentTab === 'system_variables' }" @click="currentTab = 'system_variables'">{{$t('service.settings.systemVariables')}}</li>
          </ul>
          <div class="tab-content">
            <BasicSetting
              v-show="currentTab === 'basic'"
              :space="route.space"
              :service="route.service"
              :plugin="route.plugin"
              :service-config="pluginConfig"
            />
            <MarkdownEditor
              v-if="plugin.description != null"
              v-show="currentTab === 'readme'"
              v-model="plugin.description"
              :placeholder="$t('service.settings.serviceReadmeHolder')"
              @update:modelValue="saveConfig"
            />
            <Variables
              ref="variables"
              v-show="currentTab === 'variables'"
              :space="route.space"
              :service="route.service"
              :plugin="route.plugin"
            />
            <SettingFiles
              v-show="currentTab === 'files'"
              :space="route.space"
              :service="route.service"
              :plugin="route.plugin"
            />
            <SystemVariableTable
              v-if="currentTab === 'system_variables'"
            />
          </div>
        </template>
        <template v-else>
          <InitializeView
            :space-name="plugin.space.name"
            :service-name="plugin.service.name"
            :plugin-name="plugin.name"
            @initialized="fetchProfile"
          />
        </template>
      </div>
    </div>
    <!-- 发布窗口 -->
    <PublishWindow ref="publishWindow"/>
    <!-- 服务代码错误窗口 -->
    <ServiceCodeErrorWindow ref="serviceCodeErrorWindow"/>
  </div>
</template>

<script>
import {mapState, mapMutations} from "vuex";
import SettingFiles from "@/components/service/settings/SettingFiles.vue";
import DirectorySelect from "@/components/common/DirectorySelect.vue";
import InitializeView from "@/components/service/settings/InitializeView.vue";
import BasicSetting from "@/components/service/settings/BasicSetting.vue";
import PublishWindow from "@/components/service/PublishWindow.vue";
import Variables from "@/components/service/settings/Variables/Variables.vue";
import MarkdownEditor from "@/components/common/MarkdownEditor.vue";
import ServiceCodeErrorWindow from "@/components/service/ServiceCodeErrorWindow.vue";
import {fetchConfig, fetchProfile, saveConfig} from "@/api/plugin";
import {cleanCompile, compile} from "@/api/service.compile";
import SystemVariableTable from "@/components/service/settings/SystemVariableTable.vue";

export default {
  components: {
    SystemVariableTable,
    ServiceCodeErrorWindow,
    MarkdownEditor,
    Variables,
    PublishWindow, BasicSetting, InitializeView, DirectorySelect, SettingFiles},
  data () {
    return {
      isWorking: {
        compile: false,
        cleanCompile: false
      },
      // 路由参数
      route: {
        space: null,
        service: null,
        plugin: null
      },
      loading: true,
      currentTab: 'basic',
      plugin: null,
      pluginConfig: null
    }
  },
  computed: {
    ...mapState(['currentProject', 'currentProjectDetail', 'currentDatabase', 'installData']),
    initialized () {
      return this.pluginConfig != null && this.pluginConfig.version != null
    },
    // 编译提醒
    compileTip () {
      if (this.currentProjectDetail != null) {
        return this.$t('service.settings.compileTipWithProject', { project: this.currentProjectDetail.name })
      }
      return this.$t('service.settings.compileTip')
    },
    // 反向编译提醒
    cleanCompileTip () {
      if (this.currentProjectDetail != null) {
        return this.$t('service.settings.cleanCompileTipWithProject', { project: this.currentProjectDetail.name })
      }
      return this.$t('service.settings.cleanCompileTip')
    }
  },
  methods: {
    ...mapMutations(['setInstallData']),
    // 保存配置
    saveConfig () {
      saveConfig({
        ...this.route,
        readme: this.plugin.description
      })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 获取插件信息
    fetchProfile () {
      this.loading = true
      fetchProfile({
        spaceName: this.route.space,
        serviceName: this.route.service,
        pluginName: this.route.plugin,
      })
        .then(data => {
          this.plugin = data
        })
        .then(() => {
          return fetchConfig({
            space: this.route.space,
            service: this.route.service,
            plugin: this.route.plugin
          })
        })
        .then(pluginConfig => {
          if (pluginConfig != null) {
            this.pluginConfig = pluginConfig
            this.plugin.description = pluginConfig.readme
          }
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 编译服务
    compile () {
      if (this.isWorking.compile || this.currentProject == null || this.currentProject === '') {
        return
      }
      this.isWorking.compile = true
      compile({
        ...this.route,
        serviceType: 'COMMON',
        projectId: this.currentProject,
        database: this.currentDatabase,
        variables: this.$refs.variables.getVariables()
      })
        .then((installData) => {
          this.setInstallData(installData)
          this.$tip.success('Compile successfully.')
        })
        .catch(e => {
          if (e.code === 6000) {
            this.$refs.serviceCodeErrorWindow.open(e.errorData)
            return
          }
          this.$tip.apiFailed(e)
        })
        .finally(() => {
          this.isWorking.compile = false
        })
    },
    // 清空编译
    cleanCompile () {
      if (this.isWorking.cleanCompile || this.currentProject == null || this.currentProject === '') {
        return
      }
      this.isWorking.cleanCompile = true
      cleanCompile({
        ...this.route,
        projectId: this.currentProject,
        database: this.currentDatabase,
        variables: this.$refs.variables.getVariables()
      })
        .then(installData => {
          this.$tip.success('Clean Compile successfully.')
          this.setInstallData(installData)
        })
        .catch(e => {
          if (e.code === 6000) {
            this.$refs.serviceCodeErrorWindow.open(e.errorData)
            return
          }
          this.$tip.apiFailed(e)
        })
        .finally(() => {
          this.isWorking.cleanCompile = false
        })
    }
  },
  created () {
    this.route.space = this.$route.query.space
    this.route.service = this.$route.query.service
    this.route.plugin = this.$route.query.plugin
    this.fetchProfile()
  }
}
</script>

<style scoped lang="scss">
.page {
  height: 100%;
  padding-bottom: var(--gap-page-bottom);
  overflow: hidden;
  // 未初始化状态
  &.page-un-initialize {
    overflow-y: auto;
    padding-bottom: var(--gap-page-bottom);
    .wrap {
      height: initial;
      min-height: 100%;
      padding: var(--gap-page-padding);
    }
  }
  .wrap {
    height: 100%;
    width: var(--page-width);
    margin: 0 auto;
    box-shadow: var(--page-shadow);
    background: var(--color-light);
    padding: var(--gap-page-padding) var(--gap-page-padding) 0 var(--gap-page-padding);
    border-radius: var(--radius-page);
    display: flex;
    flex-direction: column;
  }
  .header-wrap {
    border-bottom: 3px solid;
    border-image: linear-gradient(to right, var(--primary-color-match-1), var(--primary-color-match-2), var(--primary-color)) 1;
    padding: 10px 0;
    .header {
      flex-shrink: 0;
      display: flex;
      justify-content: space-between;
    }
    .service-path {
      font-size: var(--font-size-mini)
    }
  }
  .main {
    height: 100%;
    overflow: hidden;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    // 页签
    .tabs {
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      margin: 15px 0 0 0;
      border-bottom: 1px solid var(--border-default-color);
      padding-bottom: 10px;
      li {
        margin-right: 30px;
        cursor: pointer;
        &.selected {
          font-weight: bold;
        }
        &:last-of-type {
          margin-right: 0;
        }
      }
    }
    // 页签内容
    .tab-content {
      flex-grow: 1;
      overflow-y: auto;
    }
  }
}
</style>
