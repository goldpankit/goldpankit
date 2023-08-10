<template>
  <div class="page">
    <div class="wrap">
      <div class="header">
        <h2>{{ $t('user.leasedAndPrivateServices') }}</h2>
      </div>
<!--      <div class="search-wrap">-->
<!--        <el-input size="large" placeholder="type here and press enter."/>-->
<!--      </div>-->
      <ul v-if="!loading && services.length > 0" class="service-list">
        <li v-for="service in services" :key="service.id">
          <h3>@{{service.space.name}}/{{service.name}}</h3>
          <p class="introduce">{{service.introduce}}</p>
          <p>{{$t('service.codespace')}}: {{service.codespace}}</p>
          <p>{{$t('service.repository')}}: {{service.repository}}</p>
          <div class="footer-info">
            <!-- 用户信息 -->
            <div class="user-profile">
              <img :src="getAccessUri(service.user.avatar, '/images/avatar/default.png')">
              <span>{{service.user.username}}</span>
            </div>
            <p class="text-info-1 text-mini">
              {{$t('service.lastPublish')}}: {{service.lastPublish == null ? $t('service.unPublish') : getDateOffsetText(service.lastPublish, $t)}}
            </p>
          </div>
          <!-- 只有自己的服务才存在操作 -->
          <ul v-if="userInfo.id === service.user.id" class="opera">
            <li><el-button text @click="openSettings(service)">{{$t('service.serviceSettings')}}</el-button></li>
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

export default {
  components: {Empty, Pagination},
  data () {
    return {
      loading: false,
      pagination: {
        page: 1,
        capacity: 10,
        total: 100
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
      this.$router.push({
        name: 'ServiceSettings',
        query: {
          space: service.space.name,
          service: service.name
        }
      })
    },
    // 删除服务
    deleteService (service) {
      this.$model.deleteConfirm(this.$t('service.confirmDeleteTip'))
        .then(() => {
          deleteService({
            space: service.space.name,
            service: service.name
          })
            .then(() => {
              if (this.services.length === 1) {
                this.pagination.page -= 1
                this.fetchPage()
              }
              this.$tip.success(this.$t('common.deleteSuccessfully'))
            })
            .catch(e => {
              this.$tip.apiFailed(e)
            })
        })
        .catch(() => {})
    },
    handleCurrentChange (page) {
      console.log('page', page)
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
      padding: 15px 30px;
      border-bottom: 1px solid var(--border-default-color);
      position: relative;
      &:last-of-type {
        border-bottom: 0;
      }
      & > h3 {
        font-size: var(--font-size-middle);
        margin-bottom: 15px;
      }
      & > p {
        font-size: var(--font-size-mini);
        margin-top: 5px;
      }
      & > .introduce {
        margin-bottom: 10px;
        font-size: var(--font-size);
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
        top: 10px;
        right: 20px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        margin-left: 30px;
      }
    }
  }
}
</style>
