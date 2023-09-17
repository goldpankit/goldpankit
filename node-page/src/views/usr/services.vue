<template>
  <div class="page">
    <div class="wrap">
      <div class="header">
        <h2>{{ $t('user.leasedAndPrivateServices') }}</h2>
      </div>
<!--      <div class="search-wrap">-->
<!--        <el-input size="large" placeholder="type here and press enter."/>-->
<!--      </div>-->
      <div v-loading="loading" class="service-list-wrap">
        <ul v-if="services.length > 0" class="service-list">
          <li v-for="service in services" :key="service.id">
            <!-- 服务 -->
            <ServiceTitle
              v-if="service.type === 'MAIN'"
              :space="service.space.name"
              :service="service.name"
              :service-label="service.label"
              :with-type="true"
            />
            <!-- 插件 -->
            <ServiceTitle
              v-else
              :space="service.space.name"
              :service="service.mainService.name"
              :service-label="service.mainService.label"
              :plugin="service.name"
              :plugin-label="service.label"
              :with-type="true"
            />
            <p class="introduce">{{service.introduce}}</p>
            <div class="info">
              <label>{{$t('service.codespace')}}:</label>
              <p>{{service.codespace}}</p>
            </div>
            <div class="info">
              <label>{{$t('service.repository')}}:</label>
              <p>{{service.repository}}</p>
            </div>
            <div class="footer-info">
              <!-- 用户信息 -->
              <div v-if="service.user != null" class="user-profile">
                <img :src="getAccessUri(service.user.avatar, '/images/avatar/default.png')">
                <span>{{service.user.username}}</span>
              </div>
              <ServiceStatus :with-private="service.withPrivate"/>
              <span>|</span>
              <p class="text-info-1 text-mini">
                {{service.lastPublish == null ? $t('service.unPublish') : getDateOffsetText(service.lastPublish)}}
              </p>
            </div>
            <!-- 只有自己的服务才存在操作 -->
            <ul v-if="service.user != null && userInfo.id === service.user.id" class="opera">
              <li>
                <el-button v-if="service.type === 'MAIN'" @click="openSettings(service)">
                  {{$t('service.serviceSettings')}}
                </el-button>
                <el-button v-else @click="openSettings(service)">
                  {{$t('plugin.settings')}}
                </el-button>
              </li>
              <li><el-button text type="danger" @click="deleteService(service)">{{$t('common.delete')}}</el-button></li>
            </ul>
          </li>
        </ul>
        <Empty v-else :description="$t('service.noServices')"/>
        <Pagination
          :pagination="pagination"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from "../../components/common/Pagination.vue";
import Empty from "../../components/common/Empty.vue";
import {deleteService, fetchPage} from "../../api/user.service";
import {fetchLocalServices} from "../../api/service";
import {mapState} from "vuex";
import BeanAmount from "../../components/common/BeanAmount.vue";
import ServiceTitle from "../../components/service/ServiceTitle.vue";
import ServiceStatus from "../../components/service/ServiceStatus.vue";

export default {
  components: {ServiceStatus, ServiceTitle, BeanAmount, Empty, Pagination},
  data () {
    return {
      loading: false,
      pagination: {
        page: 1,
        capacity: 10,
        total: 0
      },
      services: []
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    // 打开服务设置
    openSettings (service) {
      if (service.type === 'MAIN') {
        this.$router.push({
          name: 'ServiceSettings',
          query: {
            space: service.space.name,
            service: service.name
          }
        })
        return
      }
      this.$router.push({
        name: 'PluginSettings',
        query: {
          space: service.space.name,
          service: service.mainService.name,
          plugin: service.name,
        }
      })
    },
    // 删除服务或插件
    deleteService (service) {
      let unique
      // 删除服务
      if (service.type === 'MAIN') {
        unique = {
          space: service.space.name,
          service: service.name
        }
      }
      // 删除插件
      else {
        unique = {
          space: service.space.name,
          service: service.mainService.name,
          plugin: service.name
        }
      }
      this.deleteConfirm(this.$t('service.confirmDeleteTip'))
        .then(() => {
          deleteService({
            id: service.id,
            // 用于删除本地数据
            ...unique
          })
            .then(() => {
              // 剩下最后一条，page-1
              if (this.services.length === 1) {
                this.pagination.page -= 1
              }
              this.fetchPage()
              this.$tip.success(this.$t('common.deleteSuccessfully'))
            })
            .catch(e => {
              this.$tip.apiFailed(e)
            })
        })
        .catch(() => {})
    },
    handleCurrentChange (page) {
      this.pagination.page = page
      this.fetchPage()
    },
    handleSizeChange (capacity) {
      this.pagination.capacity = capacity
      this.fetchPage()
    },
    // 查询分页
    fetchPage () {
      if (this.loading) {
        return
      }
      this.loading = true
      if (this.pagination.page < 1) {
        this.pagination.page = 1
      }
      fetchPage({
        ...this.pagination,
        model: {}
      })
        .then(data => {
          this.services = data.records
          this.pagination.total = data.total
          this.fetchLocalServices()
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 查询本地服务
    fetchLocalServices () {
      fetchLocalServices()
        .then(localServices => {
          this.services.forEach(service => {
            service.codespace = null
            // 服务
            if (service.type === 'MAIN') {
              const localService = localServices.find(s => s.space === service.space.name && s.name === service.name)
              if (localService != null) {
                service.repository = localService.repository
                service.codespace = localService.codespace
              }
              return
            }
            // 插件
            const localPlugin = localServices.find(s => s.space === service.space.name && s.service === service.mainService.name && s.name === service.name)
            if (localPlugin != null) {
              service.repository = localPlugin.repository
              service.codespace = localPlugin.codespace
            }
          })
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    }
  },
  created () {
    this.fetchPage()
  }
}
</script>

<style scoped lang="scss">
.page {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 30px;
  .wrap {
    width: var(--page-width);
    margin: 0 auto;
    overflow-y: auto;
  }
  .header {
    display: flex;
    justify-content: space-between;
    h2 {
      margin-bottom: 20px;
    }
  }
  .search-wrap {
    margin-bottom: 20px;
    .el-input {
      height: var(--input-search-height);
      font-size: var(--font-size-middle);
    }
  }
  .pagination {
    margin: 15px 0;
  }
  .service-list-wrap {
    min-height: 500px;
  }
  ul.service-list {
    & > li {
      background-color: var(--color-light);
      padding: 25px 30px;
      border-bottom: 1px solid var(--border-default-color);
      position: relative;
      &:last-of-type {
        border-bottom: 0;
      }
      & > .service-title {
        margin-bottom: 15px;
        padding-right: 220px;
      }
      & > .introduce {
        margin-bottom: 10px;
        font-size: var(--font-size);
      }
      & > .info {
        font-size: var(--font-size-mini);
        margin-bottom: 5px;
        display: flex;
        color: var(--color-gray);
      }
      & > .price-wrap {
        display: flex;
        align-items: center;
        margin-top: 10px;
        .bean-amount {
          margin-left: 10px;
        }
      }
      // 底部信息
      .footer-info {
        margin-top: 10px;
        display: flex;
        align-items: center;
        font-size: var(--font-size-mini);
        & > * {
          margin-right: 10px;
        }
        & > span {
          color: var(--color-gray);
        }
        // 用户信息
        .user-profile {
          display: flex;
          align-items: center;
          color: var(--font-color);
          img {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            object-fit: contain;
            margin-right: 10px;
          }
        }
      }
      // 操作
      .opera {
        position: absolute;
        top: 15px;
        right: 20px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        margin-left: 30px;
        .el-button {
          margin-right: 10px;
          font-size: var(--font-size-mini);
        }
        li:last-of-type {
          .el-button {
            margin-right: 0;
          }
        }
      }
    }
  }
}
</style>
