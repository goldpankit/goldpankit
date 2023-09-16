<template>
  <div class="page">
    <div class="wrap">
      <div class="header">
        <h2>{{ $t('user.leasedAndPrivateServices') }}</h2>
      </div>
<!--      <div class="search-wrap">-->
<!--        <el-input size="large" placeholder="type here and press enter."/>-->
<!--      </div>-->
      <ul v-loading="loading" v-if="services.length > 0" class="service-list">
        <li v-for="service in services" :key="service.id">
          <h3 v-if="service.type === 'MAIN'">
            <em :class="{ service: service.type === 'MAIN' }">服务</em>
            <span>@{{service.space.name}}/{{service.name}}</span>
          </h3>
          <h3 v-else>
            <em>插件</em>
            <span>@{{service.space.name}}/{{service.mainService.name}}/{{service.name}}</span>
          </h3>
          <p class="introduce">{{service.introduce}}</p>
          <p>{{$t('service.codespace')}}: {{service.codespace}}</p>
          <p>{{$t('service.repository')}}: {{service.repository}}</p>
          <div class="price-wrap">
            <em>{{ service.withPrivate ? $t('common.private') : $t('common.public') }}</em>
<!--            <p>{{majorVersionDetail.subServices.length}} {{$t('service.plugins')}}</p>-->
<!--            <BeanAmount :price="service.price.price" :type="service.price.leaseType"/>-->
          </div>
          <div class="footer-info">
            <!-- 用户信息 -->
            <div v-if="service.user != null" class="user-profile">
              <img :src="getAccessUri(service.user.avatar, '/images/avatar/default.png')">
              <span>{{service.user.username}}</span>
            </div>
            <p class="text-info-1 text-mini">
              {{$t('service.lastPublish')}}: {{service.lastPublish == null ? $t('service.unPublish') : getDateOffsetText(service.lastPublish)}}
            </p>
          </div>
          <!-- 只有自己的服务才存在操作 -->
          <ul v-if="service.user != null && userInfo.id === service.user.id" class="opera">
            <li v-if="service.type === 'MAIN'">
              <el-button v-if="service.type === 'MAIN'" @click="openDetail(service)">查看</el-button>
            </li>
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
</template>

<script>
import Pagination from "../../components/common/Pagination.vue";
import Empty from "../../components/common/Empty.vue";
import {deleteService, fetchPage} from "../../api/user.service";
import {fetchLocalServices} from "../../api/service";
import {mapState} from "vuex";
import BeanAmount from "../../components/common/BeanAmount.vue";

export default {
  components: {BeanAmount, Empty, Pagination},
  data () {
    return {
      loading: false,
      pagination: {
        page: 1,
        capacity: 15,
        total: 0
      },
      services: []
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    // 打开服务详情
    openDetail (service) {
      if (service.type === 'COMMON') {
        return
      }
      this.$router.push({
        name: 'ServiceDetail',
        params: {
          spaceName: service.space.name,
          serviceName: service.name
        }
      })
    },
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
    // 删除服务
    deleteService (service) {
      this.deleteConfirm(this.$t('service.confirmDeleteTip'))
        .then(() => {
          deleteService({
            space: service.space.name,
            service: service.name
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
            const localService = localServices.find(s => s.space === service.space.name && s.name === service.name)
            if (localService != null) {
              service.repository = localService.repository
              service.codespace = localService.codespace
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
  ul.service-list {
    & > li {
      background-color: var(--color-light);
      padding: 25px 30px;
      border-bottom: 1px solid var(--border-default-color);
      position: relative;
      &:last-of-type {
        border-bottom: 0;
      }
      & > h3 {
        font-size: var(--font-size-middle);
        margin-bottom: 15px;
        padding-right: 220px;
        display: flex;
        em {
          background: var(--color-gray-2);
          font-size: var(--font-size-mini);
          padding: 2px 10px;
          margin-right: 5px;
          border-radius: 5px;
          font-style: normal;
          &.service {
            background: var(--primary-color-match-2-light);
          }
        }
      }
      & > p {
        font-size: var(--font-size-mini);
        margin-top: 5px;
      }
      & > .introduce {
        margin-bottom: 10px;
        font-size: var(--font-size);
      }
      & > .price-wrap {
        display: flex;
        align-items: center;
        margin-top: 10px;
        em {
          border-radius: 30px;
          margin-right: 10px;
          font-style: normal;
          color: var(--primary-color-match-3);
        }
        .bean-amount {
          margin-left: 10px;
        }
      }
      // 底部信息
      .footer-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      // 用户信息
      .user-profile {
        display: flex;
        align-items: center;
        margin-top: 10px;
        color: var(--font-color);
        img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          object-fit: contain;
          margin-right: 10px;
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
