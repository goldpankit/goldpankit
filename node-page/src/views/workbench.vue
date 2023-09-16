<template>
  <div class="page" v-loading="loading.page">
    <div v-if="!loading.page && project != null && service != null" class="wrap">
      <div>
        <div class="header">
          <div class="title">
            <h2>{{project.name}}</h2>
            <p class="project-code-space"><el-icon><Folder /></el-icon>{{currentProjectDetail.codespace}}</p>
            <div class="service-info">
              <div class="service-title-wrap">
                <ServiceTitle
                  :space="space"
                  :service="service.name"
                  :service-label="service.label"
                  :with-new-page="true"
                />
                · v{{service.version}}
              </div>
              <el-popover
                v-if="latestMainService != null && latestMainService.version !== service.version"
                :title="$t('service.upgradeTitle')"
                :width="255"
                trigger="hover"
                popper-class="upgrade-popover"
              >
                <template #default>
                  <pre>{{upgradeDescription}}</pre>
                </template>
                <template #reference>
                  <el-button
                    size="small"
                    type="primary"
                    icon="Upload"
                    @click="$router.push({
                      name: 'ServiceDetail',
                      params: {
                        space: space,
                        service: this.service.name
                      }
                    })"
                  >{{$t('service.upgrade')}}</el-button>
                </template>
              </el-popover>
            </div>
          </div>
          <div class="info">
            <em>v{{majorVersion}}</em>
            <p>{{ $t('common.currentVersion') }}</p>
          </div>
        </div>
        <div class="content-wrap">
          <!-- 服务 -->
          <div class="service-wrap">
            <!-- 搜索 -->
            <div class="search-input-wrap">
              <SearchInput :placeholder="$t('common.search')" v-model="keyword" @search="searchPlugins"/>
            </div>
            <!-- 插件列表 -->
            <PluginList
              v-loading="loading.plugins"
              :plugins="plugins"
              :custom-class="(service) => {
                return {selected: currentService != null && currentService.name === service.name}
              }"
              :installed="service => {
                return withInstalled(service)
              }"
              @click="selectPlugin($event)"
            >
              <template #title="{plugin}">
                {{plugin.label || plugin.name}}
                <el-icon v-if="hasNewVersion(plugin)"><Upload /></el-icon>
                <el-icon v-else-if="withInstalled(plugin)" class="installed-icon"><Check /></el-icon>
              </template>
            </PluginList>
          </div>
          <!-- 服务信息 -->
          <div class="setting-wrap">
            <template v-if="currentService != null">
              <h3>{{currentService.label || currentService.name}}</h3>
              <div class="main">
                <ul class="service-dimensions">
                  <li :class="{selected: currentServiceDimension === 'readme'}" @click="currentServiceDimension = 'readme'">{{$t('common.readme')}}</li>
                  <li :class="{selected: currentServiceDimension === 'install'}" @click="currentServiceDimension = 'install'">{{$t('service.install2')}}</li>
<!--                  <li class="disabled" :class="{selected: currentServiceDimension === 'issues'}">{{$t('common.issues')}}</li>-->
                </ul>
                <div class="dimension-content">
                  <div v-show="currentServiceDimension === 'readme'">
                    <MarkdownEditor v-model="currentService.description" readonly :without-padding="true"/>
                  </div>
                  <ServiceInstaller
                    ref="installer"
                    v-model:installing="isWorking.install"
                    v-model:uninstalling="isWorking.uninstall"
                    v-show="currentServiceDimension === 'install'"
                    :space="space"
                    :service="service.name"
                    :plugin="currentService.name"
                    :service-price="currentService.price.price"
                    :service-lease="currentService.latestLease"
                    :version="currentService.lastVersion"
                    :with-project="false"
                    :project-config="project"
                    @installed="refreshProject()"
                    @uninstalled="refreshProject()"
                  />
                  <div class="issue-wrap">
                    <IssueListView v-show="currentServiceDimension === 'issues'"/>
                  </div>
                </div>
              </div>
              <div class="opera">
                <template v-if="installed">
                  <el-button
                    v-if="hasNewVersion(currentService)"
                    type="primary"
                    size="large"
                    icon="Upload"
                    :disabled="isWorking.install"
                    @click="install"
                  >{{$t('service.upgrade')}}</el-button>
                  <el-button
                    v-else
                    type="primary"
                    size="large"
                    :disabled="isWorking.install"
                    @click="install"
                  >
                    {{ isWorking.install ? $t('service.installing') : $t('service.reinstall')}}
                  </el-button>
                  <el-button
                    size="large"
                    :disabled="isWorking.uninstall"
                    @click="uninstall"
                  >
                    {{ isWorking.uninstall ? $t('service.uninstalling') : $t('service.uninstall')}}
                  </el-button>
                </template>
                <el-button
                  v-else
                  type="primary"
                  size="large"
                  :disabled="isWorking.install"
                  @click="install"
                >
                  {{ isWorking.install ? $t('service.installing') : $t('service.install')}}
                </el-button>
              </div>
              <div class="opera-tip">
                <el-icon><InfoFilled /></el-icon>
                <p>{{$t('service.installTip')}}</p>
              </div>
            </template>
            <div v-else class="setting-holder">
              <h4>{{ $t('workbench.subServiceSettings') }}</h4>
              <p>{{ $t('workbench.subServiceSettingsTip') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="project == null" class="incorrect-wrap">
      <div class="content">
        <p>{{$t('workbench.noProjectTip1')}}<router-link :to="{name: 'Index'}">{{$t('common.homepage')}}</router-link>{{$t('workbench.noProjectTip2')}}</p>
      </div>
    </div>
    <div v-else-if="service == null" class="incorrect-wrap">
      <div class="content">
        <p>{{$t('workbench.noServiceInstalledTip1')}}<router-link :to="{name: 'PublicSpaces'}">{{$t('common.publicSpace')}}</router-link>{{$t('workbench.noServiceInstalledTip2')}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapState} from 'vuex'
import ServiceInstaller from "@/components/space/ServiceInstaller.vue";
import MarkdownEditor from "@/components/common/MarkdownEditor.vue";
import Empty from "@/components/common/Empty.vue";
import IssueListView from "@/components/space/IssueListView.vue";
import BeanAmount from "@/components/common/BeanAmount.vue";
import PluginList from "@/components/service/PluginList.vue";
import {fetchLatestVersion} from "@/api/service.version";
import {fetchList} from "@/api/plugin";
import {fetchById} from "@/api/user.project";
import ServiceTitle from "../components/service/ServiceTitle.vue";
import SearchInput from "../components/common/SearchInput.vue";

export default {
  components: {SearchInput, ServiceTitle, PluginList, BeanAmount, IssueListView, Empty, MarkdownEditor, ServiceInstaller},
  data () {
    return {
      loading: {
        page: true,
        plugins: true
      },
      isWorking: {
        install: false,
        uninstall: false
      },
      space: null,
      // 插件搜索关键字
      keyword: '',
      // 最新的服务信息
      latestMainService: null,
      // 项目安装的服务信息
      service: null,
      currentService: null,
      plugins: [],
      currentServiceDimension: 'readme',
      project: null
    }
  },
  watch: {
    currentProject () {
      // 切换项目后，置空最新的服务信息，让方法重新获取当前项目的最新服务信息
      this.latestMainService = null
      this.fetchProject(true)
    }
  },
  computed: {
    ...mapState(['currentProject', 'currentProjectDetail']),
    installed () {
      if (this.currentService == null) {
        return false
      }
      return this.installedPlugins[this.currentService.name] != null
    },
    // 服务主版本
    majorVersion () {
      if (this.service == null) {
        return '...'
      }
      return `${this.service.version.substring(0, this.service.version.indexOf('.'))}`
    },
    // 当前项目已安装的插件(从1.3.0开始，插件安装调整值kit.json/plugins，原来为kit.json/services)
    installedPlugins () {
      return this.project.plugins || this.project.services
    },
    // 当前项目安装的服务(从1.3.0开始，服务安装调整至kit.json/service，原来为kit.json/main)
    installedService () {
      return this.project.service || this.project.main
    },
    // 升级说明
    upgradeDescription () {
      if (this.latestMainService == null) {
        return ''
      }
      return this.$t('service.upgradeTip', {
        currentVersion: this.service.version,
        newVersion: this.latestMainService.version,
        publishDescription: this.latestMainService.publishDescription
      })
    }
  },
  methods: {
    ...mapMutations(['setCurrentProject']),
    // 安装
    install () {
      this.currentServiceDimension = 'install'
      this.$refs.installer.install()
    },
    // 卸载
    uninstall () {
      this.currentServiceDimension = 'install'
      this.$refs.installer.uninstall()
    },
    // 判断是否已安装
    withInstalled (service) {
      return this.installedPlugins[service.name] != null
    },
    // 查询项目信息
    fetchProject (withSubServices = false) {
      this.loading.page = true
      if (this.currentProject == null || this.currentProject === '') {
        this.project = null
        this.space = null
        this.loading.page = false
        return
      }
      this.refreshProject(withSubServices)
    },
    // 查询最新的服务版本
    fetchLatestVersion () {
      if (this.latestMainService != null) {
        return
      }
      fetchLatestVersion({
        space: this.space,
        service: this.service.name
      })
        .then(data => {
          this.latestMainService = data
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 刷新项目信息
    refreshProject (withSubServices = false) {
      this.loading.page = true
      fetchById(this.currentProject)
        .then(data => {
          this.project = data
          // 获取空间信息
          this.space = this.project.space
          // 获取服务信息
          if (this.installedService == null) {
            this.loading.page = false
            return
          }
          let serviceName = null
          for (const key in this.installedService) {
            serviceName = key
            break
          }
          this.service = {
            name: serviceName,
            ...this.installedService[serviceName]
          }
          // 查询最新的服务信息
          this.fetchLatestVersion()
          // 查询插件
          if (withSubServices) {
            this.searchPlugins()
          }
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
        .finally(() => {
          this.loading.page = false
        })
    },
    // 查询插件
    searchPlugins () {
      this.loading.plugins = true
      fetchList({
        space: this.space,
        service: this.service.name,
        majorVersion: this.majorVersion,
        keyword: this.keyword
      })
        .then(data => {
          this.plugins = data
          // if (this.plugins.length > 0) {
          //   this.selectPlugin(this.plugins[0])
          // }
        })
        .catch(e => {
          console.log('searchPlugins', e)
          this.$tip.apiFailed(e)
        })
        .finally(() => {
          this.loading.plugins = false
        })
    },
    // 选择插件
    selectPlugin (service) {
      if (this.plugins.length > 0) {
        this.currentService = service
      }
    },
    // 是否可升级
    hasNewVersion (service) {
      const serviceConfig = this.installedPlugins[service.name]
      if (serviceConfig == null) {
        return false
      }
      return serviceConfig.version !== service.lastVersion
    }
  },
  created () {
    const projectId = this.$route.query.project_id
    if (projectId != null && projectId !== '') {
      this.setCurrentProject(projectId)
      this.$router.replace({ name: 'Workbench'})
    }
    this.fetchProject(true)
  }
}
</script>

<style lang="scss">
.upgrade-popover {
  pre {
    word-break: break-word;
    white-space: pre-wrap;
    font-size: var(--font-size-mini);
  }
}
</style>
<style scoped lang="scss">
.page {
  height: 100%;
  .wrap {
    width: 1200px;
    height: 100%;
    margin: 0 auto;
    overflow: hidden;
    padding: 3px 3px var(--gap-page-bottom) 3px;
    & > div {
      background-color: var(--color-light);
      border-radius: var(--radius-page);
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border: 10px solid var(--color-gray-3);
    }
  }
  // 头部
  .header {
    padding: 10px 20px;
    display: flex;
    background: var(--color-gray-3);
    .title {
      flex-grow: 1;
      h2 {
        flex-shrink: 0;
      }
      // 项目目录
      .project-code-space {
        font-size: var(--font-size-mini);
        color: var(--color-gray);
        margin-top: 5px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid var(--color-gray-4);
        padding-bottom: 10px;
        margin-bottom: 10px;
        .el-icon {
          font-size: 14px;
          margin-right: 5px;
        }
      }
      // 服务信息
      .service-info {
        display: flex;
        align-items: center;
        // 服务标题
        .service-title-wrap {
          :deep(.service-title) {
            display: inline-flex;
            h3 {
              font-size: var(--font-size);
            }
          }
        }
        .el-button {
          margin-left: 10px;
        }
      }
    }
    .info {
      margin-left: 30px;
      flex-shrink: 0;
      width: 100px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      em {
        width: 100%;
        font-size: 40px;
        font-weight: bold;
        color: var(--color-light);
        background-image: linear-gradient(to right, var(--primary-color-match-2), var(--primary-color-match-1));
        text-align: center;
        text-transform: uppercase;
      }
      p {
        font-size: var(--font-size-mini);
        color: var(--color-gray);
      }
    }
  }
  .content-wrap {
    flex-grow: 1;
    overflow: hidden;
    display: flex;
    border-radius: 20px;
    .service-wrap {
      width: 275px;
      flex-shrink: 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      // 搜索
      .search-input-wrap {
        flex-shrink: 0;
        padding: 20px 20px 10px 20px;
      }
      // 插件列表
      :deep(.plugin-list) {
        li {
          padding: 10px 20px;
          h5 {
            position: relative;
            padding-right: 30px;
            font-size: var(--font-size);
            .el-icon {
              position: absolute;
              top: 0;
              right: 0;
              font-size: 20px;
              font-weight: bold;
              color: var(--primary-color-match-2);
            }
            .installed-icon {
              color: var(--color-success);
            }
          }
        }
      }
    }
    .setting-wrap {
      background-color: var(--color-light);
      flex-grow: 1;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      border-left: 1px solid var(--border-default-color);
      overflow: hidden;
      h3 {
        flex-shrink: 0;
        margin: 20px 30px 10px 30px;
        padding-bottom: 10px;
        border-bottom: 1px solid var(--border-default-color);
      }
      .main {
        flex-grow: 1;
        overflow-y: auto;
        padding: 0 30px;
        .el-input {
          height: 40px;
        }
        // 服务信息维度
        ul.service-dimensions {
          display: flex;
          border-bottom: 1px solid var(--border-default-color);
          li {
            padding: 10px 20px;
            margin-right: 10px;
            position: relative;
            border: 1px solid transparent;
            top: 1px;
            color: var(--color-gray);
            cursor: pointer;
            transition: all ease .15s;
            &.selected {
              border: 1px solid var(--border-default-color);
              border-bottom-color: var(--color-light);
              font-weight: bold;
              color: var(--font-color);
            }
            &:hover {
              color: var(--font-color);
            }
            &.disabled:hover,&.disabled {
              color: var(--color-gray-1);
            }
          }
        }
        // 维度内容
        .dimension-content {
          padding: 20px;
          border: 1px solid var(--border-default-color);
          border-top: 0;
          :deep(.service-installer) {
            .content-wrap {
              padding: 0;
            }
          }
        }
      }
      // 服务操作
      .opera {
        flex-shrink: 0;
        padding: 15px 15px 0 15px;
        border-top: 10px solid;
        border-image: linear-gradient(to right, var(--primary-color-match-1), var(--primary-color-match-2), var(--primary-color)) 1;
        display: flex;
        justify-content: center;
        .el-button {
          width: 200px;
          font-size: var(--font-size-middle);
        }
      }
      // 操作提示
      .opera-tip {
        padding: 5px 10px;
        margin-top: 5px;
        font-size: var(--font-size-mini);
        display: flex;
        .el-icon {
          flex-shrink: 0;
          margin-right: 3px;
          margin-top: 2px;
        }
      }
    }
    // 变量设置空提示
    .setting-holder {
      font-size: 18px;
      width: 455px;
      margin: 30px auto 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 50px;
      p {
        line-height: 30px;
        color: var(--color-gray);
        margin-top: 20px;
      }
    }
  }
  // 错误提示
  .incorrect-wrap {
    display: flex;
    justify-content: center;
    padding: 50px 0;
    .content {
      width: 550px;
      padding: 50px;
      background: var(--color-light);
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    p {
      font-size: var(--font-size-large);
      line-height: 35px;
      a {
        text-decoration: underline !important;
        margin: 0 5px;
      }
    }
    .el-button {
      width: 150px;
      height: 50px;
      font-size: 18px;
    }
  }
}
</style>
