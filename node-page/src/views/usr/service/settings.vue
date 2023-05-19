<template>
  <div class="page" v-loading="loading" v-if="service != null">
    <div class="wrap">
      <div class="header-wrap">
        <div class="header">
          <h2>{{service.space.name}}·{{service.name}}</h2>
          <div v-if="service.initialized" class="opera">
            <el-button @click="push">Push</el-button>
            <el-button>Pull</el-button>
            <el-button type="reverse">Publish</el-button>
          </div>
        </div>
        <p
          v-if="service.initialized && service.local != null"
          class="text-info-1 service-path"
        >At {{service.local.codespace}}</p>
      </div>
      <div class="main">
        <template v-if="service.initialized">
          <div class="nav">
            <ul class="tabs">
              <li class="selected">Files</li>
              <li>Variables</li>
            </ul>
            <div class="tab-content">
              <SettingFiles ref="settingFiles" :service-id="serviceId" @node-click="handleNodeClick"/>
            </div>
          </div>
          <div class="setting-wrap">
            <h4>File Setting</h4>
            <div class="content-wrap">
              <SettingForm :service-id="serviceId" :target="currentNode"/>
            </div>
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
              <el-button type="reverse" size="large" @click="initialize">Initialize Service</el-button>
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
import SettingForm from "../../../components/service/settings/SettingForm.vue";
import { initialize, getProfile } from "../../../api/service";

export default {
  components: {SettingForm, DirectorySelect, SettingFiles},
  data () {
    return {
      loading: true,
      serviceId: null,
      service: null,
      currentNode: null,
      directorySelect: {
        value: ''
      }
    }
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
      getProfile(this.serviceId)
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
    // 选择树节点
    handleNodeClick (node) {
      this.currentNode = node
    },
    // 推送服务代码
    push () {
      console.log(this.$refs.settingFiles.files)
    }
  },
  created () {
    this.serviceId = this.$route.query.service_id
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
    padding: var(--gap-page-padding);
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
    // 文件&变量区域
    .nav {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      width: 320px;
      flex-shrink: 0;
      padding: 20px 20px 20px 0;
      border-right: 1px solid var(--border-default-color);
      // 页签
      .tabs {
        flex-shrink: 0;
        display: flex;
        margin-bottom: 10px;
        li {
          margin-right: 10px;
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
    // 设置区域
    .setting-wrap {
      flex-grow: 1;
      background: var(--color-light);
      padding: 20px 0 20px 20px;
      overflow: hidden;
      .content-wrap {
        padding: 20px 0;
      }
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
