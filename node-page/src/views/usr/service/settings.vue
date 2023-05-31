<template>
  <div class="page" v-loading="loading" v-if="service != null">
    <div class="wrap">
      <div class="header-wrap">
        <div class="header">
          <h2>{{service.space.name}}·{{service.name}}</h2>
          <div v-if="service.initialized" class="opera">
<!--            <el-button type="important" @click="push">Push</el-button>-->
            <el-button type="primary" :disabled="currentProject == null" @click="compile">Compile</el-button>
            <el-button type="primary" @click="push">Publish</el-button>
          </div>
        </div>
        <p
          v-if="service.initialized && service.local != null"
          class="text-info-1 service-path"
        >At {{service.local.codespace}}</p>
      </div>
      <div class="main">
        <template v-if="service.initialized">
          <ul class="tabs">
            <li :class="{ selected: currentTab === 'basic' }" @click="currentTab = 'basic'">Basic</li>
            <li :class="{ selected: currentTab === 'variables' }" @click="currentTab = 'variables'">Variables</li>
            <li :class="{ selected: currentTab === 'files' }" @click="currentTab = 'files'">Files</li>
          </ul>
          <div class="tab-content">
            <SettingFiles
              v-show="currentTab === 'files'"
              :service-id="serviceId"
            />
            <SettingVariables
              ref="variables"
              v-show="currentTab === 'variables'"
              :service-id="serviceId"
            />
          </div>
        </template>
        <template v-else>
          <div class="initialize-wrap">
            <div class="tip">
              <h3>Initialize Service</h3>
              <p>You must first specify or create a local directory and initialize the service. Then you can code the service in the specified local directory.</p>
            </div>
            <div class="directory-select-wrap">
              <DirectorySelect v-if="!loading" v-model="directorySelect.value" title="Select Service Directory"/>
            </div>
            <div class="opera-bottom">
              <el-button type="primary" size="large" @click="initialize">Initialize Service</el-button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import SettingFiles from "../../../components/service/settings/SettingFiles.vue";
import DirectorySelect from "../../../components/common/DirectorySelect.vue";
import SettingVariables from "../../../components/service/settings/SettingVariables.vue";
import {initialize, getProfile, push} from "../../../api/service";
import {mapState} from "vuex";
import {compile} from "../../../api/service.compile";

export default {
  components: {SettingVariables, DirectorySelect, SettingFiles},
  data () {
    return {
      // 路由参数
      route: {
        space: '',
        service: ''
      },
      loading: true,
      currentTab: 'variables',
      service: null,
      directorySelect: {
        value: ''
      }
    }
  },
  computed: {
    ...mapState(['currentProject'])
  },
  methods: {
    // 初始化
    initialize () {
      initialize({
        id: this.$route.query.service_id,
        name: this.service.name,
        type: this.service.type,
        codespace: this.directorySelect.value
      })
        .then(() => {
          this.service.initialized = true
        })
        .catch(e => {
          console.log('e', e)
        })
    },
    // 获取服务信息
    getProfile () {
      this.loading = true
      getProfile({
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
        serviceId: this.service.id,
        projectId: this.currentProject.id
      })
        .then(() => {
          console.log('编译成功')
        })
        .catch(e => {
          console.log('e', e)
        })
    },
    // 推送服务代码
    push () {
      push(this.serviceId)
        .then(data => {
          console.log('推送成功', data)
        })
        .catch(e => {
          console.log('e', e)
        })
    }
  },
  created () {
    this.route.space = this.$route.params.space
    this.route.service = this.$route.params.service
    this.getProfile()
  }
}
</script>

<style scoped lang="scss">
.page {
  height: 100%;
  padding-bottom: var(--gap-page-bottom);
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
      margin: 15px 0 10px 0;
      li {
        margin-right: 10px;
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
    // 初始化
    .initialize-wrap {
      width: 650px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      padding-top: var(--gap-page-bottom);
      .tip {
        text-align: center;
        h3 {
          margin-bottom: 20px;
          font-size: var(--font-size-large);
        }
        p {
          font-size: var(--font-size-middle);
          line-height: 1.5;
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
  }
}
</style>
