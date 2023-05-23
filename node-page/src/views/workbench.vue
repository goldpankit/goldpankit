<template>
  <div class="page">
    <div v-if="space != null" class="wrap">
      <div>
        <div class="header">
          <div class="title">
            <h2>{{project.name}}</h2>
            <p class="service-info">{{space.name}} · {{framework.name}}</p>
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
            <ul class="service-list">
              <li
                v-for="service in services"
                :key="service.id"
                :class="{ selected: currentService != null && currentService.id === service.id }"
                @click="selectService(service)"
              >
                <h5>{{service.name}}</h5>
                <p>集成支付宝支付，提供完善健全的支付接口</p>
              </li>
            </ul>
          </div>
          <!-- 设置 -->
          <div class="setting-wrap">
            <h3>Settings</h3>
            <div class="main">
              <el-form>
                <el-form-item label="接口地址" required>
                  <el-input placeholder="/pay/alipay"/>
                </el-form-item>
                <el-form-item label="API KEY">
                  <el-input placeholder="type your API KEY"/>
                </el-form-item>
                <el-form-item label="API SECRET">
                  <el-input placeholder="type your API SECRET"/>
                </el-form-item>
              </el-form>
            </div>
            <div class="opera">
              <el-button type="primary" size="large" @click="install">Install</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {search} from "../api/service";
import {compile} from "../api/service.compile";
import {fetchById} from "../api/user.project";
import {fetchByName} from "../api/service.space";

export default {
  data () {
    return {
      version: 'v1',
      services: [],
      currentService: null,
      project: null,
      framework: null,
      space: null
    }
  },
  computed: {
    ...mapState(['currentProject'])
  },
  methods: {
    // 查询项目信息
    fetchProject () {
      fetchById(this.currentProject.id)
        .then(data => {
          this.project = data
          // 获取框架服务信息
          let frameworkName = null
          for (const key in this.project.framework) {
            frameworkName = key
            break
          }
          this.framework = {
            name: frameworkName,
            ...this.project.framework
          }
          this.fetchSpace()
        })
        .catch(e => {
          console.log('e', e)
        })
    },
    // 查询服务空间
    fetchSpace () {
      fetchByName(this.project.space)
        .then(data => {
          this.space = data
          this.searchSubServices()
        })
        .catch(e => {
          console.log('e' ,e)
        })
    },
    // 查询子服务
    searchSubServices () {

      search({
        spaceName: this.space.name,
        followServiceName: this.framework.name,
        serviceTypes: ['common', 'page', 'logic', 'issue']
      })
        .then(data => {
          this.services = data
        })
        .catch(e => {
          console.log('e', e)
        })
    },
    // 选择服务
    selectService (service) {
      this.currentService = service
    }
  },
  created () {
    this.fetchProject()
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
      width: 350px;
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
            background: var(--primary-color-match-1);
          }
          h5 {
            font-size: var(--font-size-middle);
            margin-bottom: 5px;
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
  }
}
</style>
