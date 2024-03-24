<template>
  <div v-loading="loading" class="page">
    <div v-if="space != null && service != null" class="wrap">
      <div class="header">
        <ServiceTitle :space="space.name" :service="service.name" :service-label="service.label"/>
        <div class="tech-stack-wrap">
          <ServiceStatus :with-private="service.withPrivate"/>
          <p>{{majorVersionDetail.subServices.length}} {{$t('service.plugins')}}</p>
          <BeanAmount :price="service.price.price" :type="service.price.leaseType"/>
        </div>
        <ul v-if="majorVersions.length > 1" class="major-versions">
          <li
            v-for="version in majorVersions"
            :key="version"
            :class="{ selected: version === currentMajorVersion }"
            @click="changeMajorVersion(version)"
          >v{{version}}</li>
        </ul>
      </div>
      <div class="content-wrap">
        <!-- 维度 -->
        <div class="dimension-wrap">
          <ul class="dimensions">
            <li :class="{ selected: currentTab === 'readme' }" @click="currentTab = 'readme'">{{$t('common.readme')}}</li>
            <li :class="{ selected: currentTab === 'extends' }" @click="currentTab = 'extends'">{{$t('service.subServices')}}</li>
            <li :class="{ selected: currentTab === 'structure' }" @click="currentTab = 'structure'">{{$t('service.structure')}}</li>
<!--            <li class="disabled" :class="{ selected: currentTab === 'issues' }">{{$t('common.issues')}}</li>-->
          </ul>
          <div v-if="majorVersionDetail != null" class="detail">
            <MarkdownEditor v-show="currentTab === 'readme'" v-model="majorVersionDetail.description" :readonly="true" :without-padding="true"/>
            <PluginList v-show="currentTab === 'extends'" :plugins="majorVersionDetail.subServices"/>
            <ServiceStructureView
              v-if="currentVersion != null"
              v-show="currentTab === 'structure'"
              :space="route.space"
              :service="route.service"
              :version="currentVersion"
            />
          </div>
        </div>
        <!-- 右侧 -->
        <div class="info">
          <!-- 用户信息 -->
          <div class="user-profile">
            <div class="user-info">
              <img :src="getAvatarUri(service.user.avatar)">
              <h4>{{getUserDisplayName(service.user)}}</h4>
            </div>
            <p class="introduce">
              {{service.user.introduce === '' || service.user.introduce == null ? 'No introduce' : service.user.introduce }}
            </p>
          </div>
          <!-- 安装服务 -->
          <div class="install">
            <el-button
              type="important"
              size="large"
              @click="$router.push({
                name: 'ServiceInstaller',
                params: {
                  spaceName: space.name,
                  serviceName: service.name
                },
                query: {
                  major: currentMajorVersion
                }
              })"
            >
              <i class="iconfont icon-code"></i>{{$t('service.install')}}
            </el-button>
            <el-button
              v-if="userInfo != null && userInfo.isDeveloper"
              size="large"
              @click="$router.push({
                name: 'CreatePlugin',
                query: {
                  space: space.name,
                  service: service.name
                }
              })"
            >{{$t('plugin.create2')}}</el-button>
<!--            <el-button-->
<!--              type="primary"-->
<!--              size="large"-->
<!--              disabled-->
<!--            >{{$t('issue.createNewIssue')}}</el-button>-->
          </div>
          <!-- 服务基础信息 -->
          <ul class="info-list">
            <li>
              <label>{{$t('service.subServices')}}</label>
              <p>{{majorVersionDetail.subServices.length}}</p>
            </li>
            <li>
              <label>{{$t('service.repository')}}</label>
              <a v-if="service.repository != null && service.repository !== ''" :href="service.repository" target="_blank">{{service.repository}}</a>
              <p v-else>{{$t('common.none')}}</p>
            </li>
            <li>
              <label>{{$t('service.lastPublish')}}</label>
              <p v-if="service.lastPublish != null">{{getDateOffsetText(service.lastPublish)}}</p>
              <p v-else>None</p>
            </li>
          </ul>
          <div v-if="relationServices.length > 0" class="relation-services-wrap">
            <h4>{{$t('service.relationList')}}</h4>
            <VerticalServiceList :services="relationServices"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ServiceStructureView from "@/components/space/ServiceStructureView.vue";
import PluginList from "@/components/service/PluginList.vue";
import MarkdownEditor from "@/components/common/MarkdownEditor.vue";
import BeanAmount from "@/components/common/BeanAmount.vue";
import {fetchList, fetchServiceDetail} from "@/api/service";
import {fetchProfileByName} from "@/api/service.space";
import VerticalServiceList from "../../components/service/VerticalServiceList.vue";
import ServiceTitle from "../../components/service/ServiceTitle.vue";
import ServiceStatus from "../../components/service/ServiceStatus.vue";
import {mapState} from "vuex";

export default {
  components: {
    ServiceStatus,
    ServiceTitle, VerticalServiceList, BeanAmount, MarkdownEditor, PluginList, ServiceStructureView },
  data () {
    return {
      loading: true,
      route: {
        space: null,
        service: null
      },
      currentTab: 'readme',
      // 当前主版本
      currentMajorVersion: '',
      // 当前版本号
      currentVersion: null,
      // 主版本列表
      majorVersions: [],
      // 空间信息
      space: null,
      // 服务信息
      service: null,
      // 主版本详情
      majorVersionDetail: null,
      // 相关服务
      relationServices: []
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    // 初始化数据
    initData () {
      this.loading = true
      // 清空数据
      this.space = null
      this.service = null
      this.currentVersion = null
      // 重新初始化
      this.fetchSpace()
      this.fetchServices()
      this.fetchDetail()
    },
    // 切换主版本
    changeMajorVersion (majorVersion) {
      if (this.currentMajorVersion === majorVersion) {
        return
      }
      this.currentMajorVersion = majorVersion
      this.fetchDetail(majorVersion)
    },
    // 查询空间
    fetchSpace() {
      fetchProfileByName(this.route.space)
        .then(data => {
          this.space = data
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 查询空间下的服务
    fetchServices () {
      fetchList({
        space: this.route.space,
        withSpaceInfo: false,
        withPublisher: false
      })
        .then(data => {
          this.relationServices = data.filter(service => this.route.service !== service.name)
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 查询详情
    fetchDetail (majorVersion) {
      fetchServiceDetail({
        ...this.route,
        majorVersion
      })
        .then(data => {
          // 未发布或已被删除
          if (data == null) {
            this.alert('该服务还未发布或已被删除')
              .then(() => {
                this.$router.push({ name: 'PublicServices' })
              })
            return
          }
          this.service = data
          this.majorVersions = data.majorVersions
          this.currentMajorVersion = majorVersion || this.majorVersions[0]
          this.majorVersionDetail = data.defaultMajorVersion
          this.currentVersion = this.majorVersionDetail.version
          if (this.majorVersionDetail.description == null && this.majorVersionDetail.description.trim() === '') {
            this.majorVersionDetail.description = 'No Descriptions'
          }
        })
        .catch(e => {
          // 无权访问
          if (e.code === 5110 || e.code === 4002) {
            this.alert(e.message)
              .then(() => {
                this.$router.push({ name: 'PublicServices' })
              })
            return
          }
          this.$tip.apiFailed(e)
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.route.space = to.params.spaceName
    this.route.service = to.params.serviceName
    this.initData()
    next()
  },
  created () {
    this.route.space = this.$route.params.spaceName
    this.route.service = this.$route.params.serviceName
    this.initData()
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
  .header {
    position: relative;
    :deep(.service-title h3){
      font-size: var(--font-size-large) !important;
      a {
        color: var(--font-color) !important;
        &:hover {
          color: var(--color-gray-deep);
        }
      }
    }
    // 技术栈
    .tech-stack-wrap {
      display: flex;
      align-items: center;
      margin-top: 10px;
      em {
        margin-right: 10px;
      }
      .bean-amount {
        margin-left: 10px;
      }
    }
    // 主版本号列表
    .major-versions {
      position: absolute;
      top: 5px;
      right: 0;
      display: flex;
      align-items: center;
      li {
        padding: 0 10px;
        cursor: pointer;
        font-size: var(--font-size-middle);
        font-weight: bold;
        font-style: italic;
        text-transform: uppercase;
        &.selected {
          color: var(--primary-color-match-2);
        }
      }
    }
  }
  .content-wrap {
    display: flex;
    margin-top: 25px;
    .dimension-wrap {
      flex-grow: 1;
      overflow: hidden;
      // 空间维度
      .dimensions {
        display: flex;
        border-bottom: 3px solid;
        border-image: var(--border-colors);
        li {
          text-align: center;
          line-height: 40px;
          font-size: var(--font-size-middle);
          cursor: pointer;
          width: 25%;
          flex-shrink: 0;
          &.selected {
            background-image: linear-gradient(to right, var(--primary-color), var(--primary-color-5));
            color: var(--primary-color-reverse);
            border-radius: 10px 10px 0 0;
          }
          &.disabled {
            color: var(--color-gray-1);
          }
        }
      }
      // 维度详情
      .detail {
        padding: 20px 20px 0 0;
        :deep(.service-list) {
          justify-content: space-between;
          li {
            width: 49%;
            margin-right: 0;
          }
        }
      }
    }
    .info {
      width: 255px;
      flex-shrink: 0;
      border-left: 1px solid var(--border-default-color);
      padding: 0 0 0 30px;
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
        .introduce {
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
          font-size: var(--font-size);
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
      // 服务基础信息
      ul.info-list {
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
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      // 相关服务
      .relation-services-wrap {
        & > h4 {
          font-weight: normal;
          font-size: var(--font-size);
          margin-bottom: 10px;
          color: var(--color-gray);
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
  }
}
</style>
