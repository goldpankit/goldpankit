<template>
  <div v-if="space != null" class="page">
    <div class="wrap">
      <h2>{{ space.name }}</h2>
      <div class="tech-stack-wrap">
        <em>Private</em>
        <p class="tech-stack">55 services</p>
      </div>
      <div class="content-wrap">
        <div class="dimension-wrap">
          <ul class="dimensions">
            <li>Readme</li>
            <li class="selected">Services</li>
            <li>Prices</li>
            <li>Issues</li>
          </ul>
          <div class="detail">
            <ul v-show="currentFrameworkService == null" class="service-list">
              <li v-for="service in frameworkServices" @click="currentFrameworkService = service">
                <h4>{{service.name}}</h4>
                <p>{{service.description}}</p>
                <section class="infos">
                  <p>21 sub versions</p>
                  <p>Latest version: 2.2.0</p>
                </section>
                <section class="infos text-info-1">
                  <p>Last publish: 3 weeks ago</p>
                </section>
                <div class="opera">
                  <el-button size="small" @click="$router.push({ name: 'ServiceSettings', query: { service_id: service.id } })">Edit</el-button>
                </div>
              </li>
            </ul>
            <ServiceDetail
              v-if="currentFrameworkService != null && currentFrameworkServiceVersion == null"
              :framework-service="currentFrameworkService"
              @install="handleServiceInstall"
              @back="currentFrameworkService = null"
            />
            <ServiceInstaller
              v-if="currentFrameworkServiceVersion != null"
              :space="space"
              :service="currentFrameworkService"
              :service-version="currentFrameworkServiceVersion"
              :with-breadcrumbs="true"
              :with-install-button="true"
              @back="currentFrameworkServiceVersion = null"
            />
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
              @click="$router.push({ name: 'CreateService', query: { space_name: spaceName } })"
            >Create New Service</el-button>
            <el-button
              type="primary"
              size="large"
              @click="$router.push({ name: 'CreateService', query: { space_name: spaceName } })"
            >Create New Issue</el-button>
          </div>
          <ul>
            <li>
              <label>Home Page</label>
              <a href="#">http://eva.adjustrd.com</a>
            </li>
            <li>
              <label>Services</label>
              <p>55</p>
            </li>
            <li>
              <label>Last Publish</label>
              <p>3 month ago</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ServiceDetail from "../../components/space/ServiceDetail.vue";
import ServiceInstaller from "../../components/space/ServiceInstaller.vue";
import {fetchByName} from "../../api/service.space";
import {search} from "../../api/service";

export default {
  components: {ServiceInstaller, ServiceDetail},
  data () {
    return {
      spaceName: null,
      // 当前选择的框架服务
      currentFrameworkService: null,
      // 当前选择的框架服务版本
      currentFrameworkServiceVersion: null,
      space: null,
      // 框架服务列表
      frameworkServices: []
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
        spaceName: this.spaceName,
        serviceTypes: ['framework']
      })
        .then(data => {
          this.frameworkServices = data
        })
        .catch(e => {
          console.log('e', e)
        })
    },
    // 服务安装
    handleServiceInstall (version) {
      this.currentFrameworkServiceVersion = version
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
        border-image: linear-gradient(to right, var(--primary-color), var(--primary-color-match-2), var(--primary-color-match-1)) 1;
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
