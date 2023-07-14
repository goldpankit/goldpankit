<template>
  <div v-if="space != null" class="page">
    <div class="wrap">
      <h2>{{ space.name }}</h2>
      <div class="tech-stack-wrap">
        <em>Private</em>
        <p class="tech-stack">{{space.serviceCount}} services</p>
      </div>
      <div class="content-wrap">
        <div class="dimension-wrap">
          <ul class="dimensions">
            <li :class="{ selected: currentTab === 'readme' }" @click="currentTab = 'readme'">Readme</li>
            <li :class="{ selected: currentTab === 'services' }" @click="currentTab = 'services'">Services</li>
            <li :class="{ selected: currentTab === 'prices' }" @click="currentTab = 'prices'">Prices</li>
            <li :class="{ selected: currentTab === 'issues' }" @click="currentTab = 'issues'">Issues</li>
          </ul>
          <div class="detail">
            <template v-if="currentTab === 'readme'">
              <div class="readme">
                <MarkdownEditor readonly :without-padding="true" v-model="space.description"/>
              </div>
            </template>
            <template v-else-if="currentTab === 'services'">
              <ul v-if="currentMainService == null && mainServices.length > 0" class="service-list">
                <li v-for="service in mainServices" @click="currentMainService = service">
                  <h4>{{service.name}}</h4>
                  <p>{{service.introduce}}</p>
                  <section class="infos">
                    <p>{{service.versionCount}} versions</p>
                    <p>Latest version: {{service.lastVersion}}</p>
                  </section>
                  <section class="infos text-info-1">
                    <p>Last publish: {{service.lastPublish}}</p>
                  </section>
                  <div class="opera">
                    <el-button size="small" @click="$router.push({ name: 'ServiceSettings', query: { service_id: service.id } })">Edit</el-button>
                  </div>
                </li>
              </ul>
              <Empty v-else-if="currentMainService == null && mainServices.length === 0" description="No Services"/>
              <MainServiceDetail
                v-if="currentMainService != null && currentMainServiceVersion == null"
                :space="space.name"
                :service="currentMainService.name"
                @install="handleServiceInstall"
                @back="currentMainService = null"
              />
              <ServiceInstaller
                v-if="currentMainServiceVersion != null"
                :space="space.name"
                :service="currentMainService.name"
                :version="currentMainServiceVersion"
                :with-breadcrumbs="true"
                :with-install-button="true"
                @back="currentMainServiceVersion = null"
                @installed="$router.push({name: 'Workbench'})"
              />
            </template>
            <template v-else-if="currentTab === 'prices'">
              <ServiceListView :services="[]" empty-description="No Price Services"/>
            </template>
            <template v-else-if="currentTab === 'issues'">
              <IssueListView/>
            </template>
          </div>
        </div>
        <div class="info">
          <div class="user-profile">
            <div class="user-info">
              <img src="/avatar.png">
              <h4>Caesar Liu</h4>
            </div>
            <p class="description">Kit联合创始人，从业10年，精通Java、Vue等技术栈。</p>
          </div>
          <div class="install">
            <el-button
              type="primary"
              size="large"
              @click="$router.push({ name: 'CreateService', query: { space: spaceName } })"
            >Create New Service</el-button>
            <el-button
              type="primary"
              size="large"
              @click="$router.push({ name: 'CreateService', query: { space: spaceName } })"
            >Create New Issue</el-button>
          </div>
          <ul>
            <li>
              <label>Home Page</label>
              <a v-if="space.homePage != null && space.homePage !== ''" href="#">{{space.homePage}}</a>
              <p v-else>None</p>
            </li>
            <li>
              <label>Services</label>
              <p>{{space.serviceCount}}</p>
            </li>
            <li>
              <label>Last Publish</label>
              <p v-if="space.lastPublish != null">{{space.lastPublish}}</p>
              <p v-else>None</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MainServiceDetail from "../../components/space/MainServiceDetail.vue";
import ServiceInstaller from "../../components/space/ServiceInstaller.vue";
import {fetchByName} from "../../api/service.space";
import {search} from "../../api/service";
import MarkdownEditor from "../../components/common/MarkdownEditor.vue";
import Empty from "../../components/common/Empty.vue";
import IssueListView from "../../components/space/IssueListView.vue";
import ServiceListView from "../../components/space/ServiceListView.vue";

export default {
  components: {IssueListView, ServiceListView, Empty, MarkdownEditor, ServiceInstaller, MainServiceDetail},
  data () {
    return {
      spaceName: null,
      currentTab: 'readme',
      // 当前选择的框架服务
      currentMainService: null,
      // 当前选择的框架服务版本
      currentMainServiceVersion: null,
      space: null,
      // 框架服务列表
      mainServices: []
    }
  },
  methods: {
    // 查询空间信息
    fetchSpace () {
      fetchByName(this.spaceName)
        .then(data => {
          this.space = data
          this.fetchServiceList()
        })
        .catch(e => {
          console.log('e', e)
        })
    },
    // 查询服务列表
    fetchServiceList () {
      search({
        space: this.spaceName,
        serviceTypes: ['MAIN']
      })
        .then(data => {
          this.mainServices = data
        })
        .catch(e => {
          console.log('e', e)
        })
    },
    // 服务安装
    handleServiceInstall (version) {
      this.currentMainServiceVersion = version
    }
  },
  created () {
    this.spaceName = this.$route.params.name
    this.fetchSpace()
  }
}
</script>

<style scoped lang="scss">
.page {
  height: 100%;
  overflow-y: auto;
  .wrap {
    width: var(--page-width);
    margin: 0 auto 100px auto;
    background: var(--color-light);
    padding: var(--gap-page-padding);
    box-sizing: border-box;
    border-radius: var(--radius-page);
    box-shadow: var(--page-shadow);
  }
  // 技术栈
  .tech-stack-wrap {
    display: flex;
    align-items: center;
    margin-top: 10px;
    em {
      //padding: 5px 15px;
      border-radius: 30px;
      //background-color: #efc3ff;
      margin-right: 10px;
      font-style: normal;
      color: var(--primary-color-match-3);
    }
  }
  // 框架列表
  .frameworks {
    display: flex;
    padding: 15px 0;
    border-bottom: 1px solid var(--border-default-color);
    margin-top: 10px;
    margin-bottom: var(--gap-title);
    ul {
      display: flex;
      font-size: var(--font-size-middle);
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
  }
  .content-wrap {
    display: flex;
    margin-top: 25px;
    .dimension-wrap {
      flex-grow: 1;
      // 空间维度
      .dimensions {
        display: flex;
        border-bottom: 3px solid;
        border-image: var(--border-colors);
        li {
          flex-grow: 1;
          text-align: center;
          line-height: 40px;
          font-size: var(--font-size-middle);
          cursor: pointer;
          &.selected {
            background-image: linear-gradient(to right, var(--primary-color), var(--primary-color-5));
            color: var(--primary-color-reverse);
            border-radius: 10px 10px 0 0;
          }
        }
      }
      // 维度详情
      .detail {
        padding: 20px 20px 0 0;
      }
    }
    .info {
      width: 255px;
      flex-shrink: 0;
      border-left: 1px solid var(--border-default-color);
      padding: 0 30px;
      box-sizing: border-box;
      // 用户简介
      .user-profile {
        padding-bottom: 20px;
        margin-bottom: 20px;
        border-bottom: 2px solid;
        border-color: linear-gradient(to right, var(--primary-color-match-1-transition), var(--primary-color-match-1)) 1;
        .user-info {
          display: flex;
          align-items: center;
          img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-right: 10px;
          }
        }
        .description {
          margin-top: 5px;
          font-size: var(--font-size-mini);
        }
      }
      // 安装
      .install {
        border-bottom: 2px solid;
        border-color: linear-gradient(to right, var(--primary-color), var(--primary-color-match-1)) 1;
        margin-bottom: 20px;
        .el-button {
          width: 100%;
          font-size: var(--font-size-middle);
          font-weight: bold;
          letter-spacing: 2px;
          margin: 0 0 10px 0;
          &:nth-of-type(1),&:nth-of-type(2) {
            font-size: var(--font-size);
            letter-spacing: 0;
          }
          &:last-of-type {
            margin-bottom: 20px;
          }
        }
      }
      ul {
        li {
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          border-bottom: 1px solid var(--border-default-color);
          padding-bottom: 20px;
          label {
            color: var(--color-gray);
            margin-bottom: 5px;
          }
          p,a {
            font-size: var(--font-size-middle);
            font-weight: bold;
          }
        }
      }
    }
    // 服务类型
    ul.service-types {
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
    // 服务列表
    ul.service-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      & > li {
        width: 325px;
        border: 1px solid var(--border-default-color);
        padding: 20px;
        cursor: pointer;
        margin-bottom: 15px;
        border-radius: 10px;
        transition: all ease .15s;
        &:hover {
          border-color: var(--primary-color);
          background: var(--background-color);
        }
        h4 {
          font-size: var(--font-size-middle);
          margin-bottom: 10px;
        }
        .infos {
          display: flex;
          margin-top: 10px;
          font-size: var(--font-size-mini);
          p {
            margin-right: 10px;
          }
        }
        .opera {
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }
}
</style>
