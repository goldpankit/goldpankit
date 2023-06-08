<template>
  <div class="page" :class="{ 'page-un-initialize': !initialized }" v-loading="loading" v-if="service != null">
    <div class="wrap">
      <div class="header-wrap">
        <div class="header">
          <h2>{{service.space.name}}·{{service.name}}</h2>
          <div v-if="initialized" class="opera">
            <el-button type="important" :disabled="currentProject == null" @click="compile">Compile</el-button>
            <el-button type="important" @click="$refs.publishWindow.open(route.space, route.service)">Publish</el-button>
          </div>
        </div>
        <p
          v-if="initialized"
          class="text-info-1 service-path"
        >At {{service.local.codespace}}</p>
      </div>
      <div class="main">
        <template v-if="initialized">
          <ul class="tabs">
            <li :class="{ selected: currentTab === 'basic' }" @click="currentTab = 'basic'">Basic</li>
            <li :class="{ selected: currentTab === 'variables' }" @click="currentTab = 'variables'">Variables</li>
            <li :class="{ selected: currentTab === 'files' }" @click="currentTab = 'files'">Files</li>
          </ul>
          <div class="tab-content">
            <BasicSetting
              v-if="currentTab === 'basic'"
              :space="route.space"
              :service="route.service"
            />
            <SettingFiles
              v-show="currentTab === 'files'"
              :space="route.space"
              :service="route.service"
            />
            <Variables
              v-show="currentTab === 'variables'"
              :space="route.space"
              :service="route.service"
            />
          </div>
        </template>
        <template v-else>
          <InitializeView
            :space-name="service.space.name"
            :service-name="service.name"
            @initialized="fetchProfile"
          />
        </template>
      </div>
    </div>
    <PublishWindow ref="publishWindow"/>
  </div>
</template>

<script>
import {mapState} from "vuex";
import SettingFiles from "../../../components/service/settings/SettingFiles.vue";
import DirectorySelect from "../../../components/common/DirectorySelect.vue";
import InitializeView from "../../../components/service/settings/InitializeView.vue";
import BasicSetting from "../../../components/service/settings/BasicSetting.vue";
import PublishWindow from "../../../components/service/PublishWindow.vue";
import Variables from "../../../components/service/settings/Variables/Variables.vue";
import {fetchProfile} from "../../../api/service";
import {compile} from "../../../api/service.compile";

export default {
  components: {
    Variables,
    PublishWindow, BasicSetting, InitializeView, DirectorySelect, SettingFiles},
  data () {
    return {
      // 路由参数
      route: {
        space: '',
        service: ''
      },
      loading: true,
      currentTab: 'basic',
      service: null
    }
  },
  computed: {
    ...mapState(['currentProject', 'currentDatabase']),
    initialized () {
      return this.service.local && this.service.local.codespace
    }
  },
  methods: {
    // 获取服务信息
    fetchProfile () {
      this.loading = true
      fetchProfile({
        spaceName: this.route.space,
        serviceName: this.route.service
      })
        .then(data => {
          this.service = data
        })
        .catch(e => {
          console.log('e', e)
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 编译服务
    compile () {
      compile({
        ...this.route,
        projectId: this.currentProject.id,
        database: this.currentDatabase
      })
        .then(() => {
          console.log('编译成功')
        })
        .catch(e => {
          console.log('e', e)
        })
    }
  },
  created () {
    this.route.space = this.$route.query.space
    this.route.service = this.$route.query.service
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
