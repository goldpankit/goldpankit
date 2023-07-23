<template>
  <div class="page">
    <div v-if="space != null" class="wrap">
      <div>
        <div class="header">
          <div class="title">
            <h2>{{project.name}}</h2>
            <p class="service-info">{{space}} · {{mainService.name}} · v{{mainService.version}}</p>
          </div>
          <div class="info">
            <em>{{version}}</em>
            <p>current version</p>
          </div>
        </div>
        <div class="content-wrap">
          <!-- 服务 -->
          <div class="service-wrap">
            <!-- 搜索 -->
            <div class="search-box">
              <el-input size="large" placeholder="Search"/>
            </div>
            <!-- 服务列表 -->
            <ul v-if="subServices.length > 0" class="service-list">
              <li
                v-for="service in subServices"
                :key="service.id"
                :class="{ selected: currentService != null && currentService.name === service.name }"
                @click="selectService(service)"
              >
                <h5>
                  {{service.name}}
                  <em v-if="hasNewVersion(service)">Upgradable</em>
                </h5>
                <p>{{service.lastVersion}}</p>
                <p>{{service.introduce}}</p>
                <p class="text-info-1 text-mini">Last publish: {{service.lastPublishTime}}</p>
              </li>
            </ul>
            <Empty v-else description="No Sub Services"/>
          </div>
          <!-- 服务信息 -->
          <div class="setting-wrap">
            <template v-if="currentService != null">
              <h3>{{currentService.name}}</h3>
              <div class="main">
                <ul class="service-dimensions">
                  <li :class="{selected: currentServiceDimension === 'readme'}" @click="currentServiceDimension = 'readme'">Readme</li>
                  <li :class="{selected: currentServiceDimension === 'install'}" @click="currentServiceDimension = 'install'">Install</li>
                  <li :class="{selected: currentServiceDimension === 'issues'}" @click="currentServiceDimension = 'issues'">Issues</li>
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
                    :version="currentService.lastVersion"
                    :with-project="false"
                    :project-config="project"
                    @installed="fetchProject()"
                    @uninstalled="fetchProject()"
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
                    @click="$refs.installer.install()"
                  >UPGRADE</el-button>
                  <el-button
                    v-else
                    type="primary"
                    size="large"
                    :disabled="isWorking.install"
                    @click="$refs.installer.install()"
                  >
                    {{ isWorking.install ? 'INSTALLING...' : 'REINSTALL'}}
                  </el-button>
                  <el-button
                    size="large"
                    :disabled="isWorking.uninstall"
                    @click="$refs.installer.uninstall()"
                  >
                    {{ isWorking.uninstall ? 'UNINSTALLING...' : 'UNINSTALL'}}
                  </el-button>
                </template>
                <el-button
                  v-else
                  type="primary"
                  size="large"
                  :disabled="isWorking.install"
                  @click="$refs.installer.install()"
                >
                  {{ isWorking.install ? 'INSTALLING...' : 'INSTALL'}}
                </el-button>
              </div>
            </template>
            <div v-else class="setting-holder">
              <h4>Sub Service Settings</h4>
              <p>You can open Settings by clicking on sub services on the left.</p>
            </div>
          </div>
        </div>
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

export default {
  components: {IssueListView, Empty, MarkdownEditor, ServiceInstaller},
  data () {
    return {
      isWorking: {
        install: false,
        uninstall: false
      },
      space: null,
      mainService: null,
      currentService: null,
      version: 'v1',
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
    }
  },
  methods: {
    ...mapMutations(['setCurrentProject']),
    // 查询项目信息
    fetchProject (withSubServices = false) {
      fetchById(this.currentProject)
        .then(data => {
          this.project = data
          // 获取空间信息
          this.space = this.project.space
          // 获取主服务信息
          let mainName = null
          for (const key in this.project.main) {
            mainName = key
            break
          }
          this.mainService = {
            name: mainName,
            ...this.project.main[mainName]
          }
          // 查询子服务
          if (withSubServices) {
            this.searchSubServices()
          }
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 查询子服务
    searchSubServices () {
      fetchSubServices({
        space: this.space,
        service: this.mainService.name,
        majorVersion: this.mainService.version.split('.')[0]
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
      this.currentService = service
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
      // 服务列表
      .service-list {
        flex-grow: 1;
        background-color: var(--color-light);
        overflow-y: auto;
        li {
          border-top: 1px solid var(--border-default-color);
          padding: 15px var(--gap-page-padding);
          cursor: pointer;
          &.selected {
            //background: var(--primary-color-match-1);
            color: var(--primary-color-match-2)
          }
          h5 {
            font-size: var(--font-size-middle);
            margin-bottom: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            em {
              color: var(--primary-color-match-2);
              font-size: var(--font-size-mini);
            }
          }
          p {
            color: var(--color-gray);
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
}
</style>
