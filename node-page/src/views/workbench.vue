<template>
  <div class="page" v-loading="loading">
    <div v-if="!loading && project != null && mainService != null" class="wrap">
      <div>
        <div class="header">
          <div class="title">
            <h2>{{project.name}}</h2>
            <div class="service-info">
              <p>
                {{space}} · {{mainService.name}} · v{{mainService.version}}
                <template v-if="latestMainService != null">
                  · {{$t('service.latestVersion')}}: v{{latestMainService.version}}
                </template>
              </p>
              <el-button
                v-if="latestMainService != null &&
                  latestMainService.version !== mainService.version"
                type="primary"
                icon="Upload"
                @click="$router.push({
                  name: 'SpaceDetail',
                  params: {
                    name: space
                  },
                  query: {
                    service: this.mainService.name
                  }
                })"
              >{{$t('service.upgrade')}}</el-button>
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
            <div class="search-box">
              <el-input size="large" :placeholder="$t('common.search')"/>
            </div>
            <!-- 服务列表 -->
            <SubServiceList
              :services="subServices"
              :custom-class="(service) => {
                return {selected: currentService != null && currentService.name === service.name}
              }"
              :installed="service => {
                return withInstalled(service)
              }"
              @click="selectService($event)"
            >
              <template #title="{service}">
                {{service.name}}
                <el-icon v-if="hasNewVersion(service)"><Upload /></el-icon>
                <el-icon v-else-if="withInstalled(service)" class="installed-icon"><Check /></el-icon>
              </template>
            </SubServiceList>
          </div>
          <!-- 服务信息 -->
          <div class="setting-wrap">
            <template v-if="currentService != null">
              <h3>{{currentService.name}}</h3>
              <div class="main">
                <ul class="service-dimensions">
                  <li :class="{selected: currentServiceDimension === 'readme'}" @click="currentServiceDimension = 'readme'">{{$t('common.readme')}}</li>
                  <li :class="{selected: currentServiceDimension === 'install'}" @click="currentServiceDimension = 'install'">{{$t('service.install2')}}</li>
                  <li class="disabled" :class="{selected: currentServiceDimension === 'issues'}">{{$t('common.issues')}}</li>
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
                    :service="currentService.name"
                    :service-type="currentService.type"
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
                    @click="$refs.installer.install()"
                  >{{$t('service.upgrade')}}</el-button>
                  <el-button
                    v-else
                    type="primary"
                    size="large"
                    :disabled="isWorking.install"
                    @click="$refs.installer.install()"
                  >
                    {{ isWorking.install ? $t('service.installing') : $t('service.reinstall')}}
                  </el-button>
                  <el-button
                    size="large"
                    :disabled="isWorking.uninstall"
                    @click="$refs.installer.uninstall()"
                  >
                    {{ isWorking.uninstall ? $t('service.uninstalling') : $t('service.uninstall')}}
                  </el-button>
                </template>
                <el-button
                  v-else
                  type="primary"
                  size="large"
                  :disabled="isWorking.install"
                  @click="$refs.installer.install()"
                >
                  {{ isWorking.install ? $t('service.installing') : $t('service.install')}}
                </el-button>
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
    <div v-else-if="mainService == null" class="incorrect-wrap">
      <div class="content">
        <p>{{$t('workbench.noServiceInstalledTip1')}}<router-link :to="{name: 'PublicSpaces'}">{{$t('common.publicSpace')}}</router-link>{{$t('workbench.noServiceInstalledTip2')}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapState} from 'vuex'
import ServiceInstaller from "../components/space/ServiceInstaller.vue";
import {fetchSubServices} from "../api/service";
import {fetchById} from "../api/user.project";
import MarkdownEditor from "../components/common/MarkdownEditor.vue";
import Empty from "../components/common/Empty.vue";
import IssueListView from "../components/space/IssueListView.vue";
import BeanAmount from "../components/common/BeanAmount.vue";
import SubServiceList from "../components/service/SubServiceList.vue";
import {fetchLatestVersion} from "../api/service.version";

export default {
  components: {SubServiceList, BeanAmount, IssueListView, Empty, MarkdownEditor, ServiceInstaller},
  data () {
    return {
      loading: true,
      isWorking: {
        install: false,
        uninstall: false
      },
      space: null,
      // 最新的主服务信息
      latestMainService: null,
      // 项目安装的主服务信息
      mainService: null,
      currentService: null,
      subServices: [],
      currentServiceDimension: 'readme',
      project: null
    }
  },
  watch: {
    currentProject () {
      this.fetchProject(true)
    }
  },
  computed: {
    ...mapState(['currentProject']),
    installed () {
      if (this.currentService == null) {
        return false
      }
      return this.project.services[this.currentService.name] != null
    },
    // 主服务主版本
    majorVersion () {
      if (this.mainService == null) {
        return '...'
      }
      return `${this.mainService.version.substring(0, this.mainService.version.indexOf('.'))}`
    }
  },
  methods: {
    ...mapMutations(['setCurrentProject']),
    // 判断是否已安装
    withInstalled (service) {
      return this.project.services[service.name] != null
    },
    // 查询项目信息
    fetchProject (withSubServices = false) {
      this.loading = true
      if (this.currentProject == null || this.currentProject === '') {
        this.project = null
        this.space = null
        this.loading = false
        return
      }
      this.refreshProject(withSubServices)
    },
    // 查询最新的主服务
    fetchMainService () {
      if (this.latestMainService != null) {
        return
      }
      fetchLatestVersion({
        space: this.space,
        service: this.mainService.name
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
      fetchById(this.currentProject)
        .then(data => {
          this.project = data
          // 获取空间信息
          this.space = this.project.space
          // 获取主服务信息
          if (this.project.main == null) {
            this.loading = false
            return
          }
          let mainName = null
          for (const key in this.project.main) {
            mainName = key
            break
          }
          this.mainService = {
            name: mainName,
            ...this.project.main[mainName]
          }
          // 查询最新的主服务信息
          this.fetchMainService()
          // 查询子服务
          if (withSubServices) {
            this.searchSubServices()
          }
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 查询子服务
    searchSubServices () {
      fetchSubServices({
        space: this.space,
        service: this.mainService.name,
        majorVersion: this.majorVersion
      })
        .then(data => {
          this.subServices = data
          if (this.subServices.length > 0) {
            this.selectService(this.subServices[0])
          }
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 选择服务
    selectService (service) {
      if (this.subServices.length > 0) {
        this.currentService = service
      }
    },
    // 是否可升级
    hasNewVersion (service) {
      const serviceConfig = this.project.services[service.name]
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

<style scoped lang="scss">
.page {
  height: 100%;
  .wrap {
    width: var(--page-width);
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
      box-shadow: var(--page-shadow);
    }
  }
  // 头部
  .header {
    padding: var(--gap-page-padding) var(--gap-page-padding) var(--gap-title) var(--gap-page-padding);
    border-bottom: 1px solid var(--border-default-color);
    display: flex;
    .title {
      flex-grow: 1;
      h2 {
        flex-shrink: 0;
      }
      // 服务信息
      .service-info {
        display: flex;
        align-items: center;
        margin-top: 10px;
        .el-button {
          margin-left: 10px;
        }
      }
    }
    .info {
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
    .service-wrap {
      width: 300px;
      flex-shrink: 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      // 搜索
      .search-box {
        flex-shrink: 0;
        margin-bottom: 15px;
        padding: 15px var(--gap-page-padding) 0 var(--gap-page-padding);
        .el-input {
          border-radius: 50px;
          :deep(.el-input__wrapper) {
            border-radius: 50px;
          }
        }
      }
      // 子服务列表
      :deep(.sub-service-list) {
        li {
          padding: 15px 30px;
          h5 {
            position: relative;
            padding-right: 30px;
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
      .opera {
        flex-shrink: 0;
        padding: 15px;
        border-top: 10px solid;
        border-image: linear-gradient(to right, var(--primary-color-match-1), var(--primary-color-match-2), var(--primary-color)) 1;
        display: flex;
        justify-content: center;
        .el-button {
          width: 200px;
          font-size: var(--font-size-middle);
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
