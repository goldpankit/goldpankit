<template>
  <div class="page">
    <div class="warp">
      <div class="search-wrap">
        <div class="input-wrap">
          <el-icon size="20"><Search/></el-icon>
          <el-input
            v-model="keyword"
            size="large"
            :placeholder="$t('service.searchPlaceholder')"
            @keypress.enter.native="search"
          />
        </div>
        <el-button size="large" type="primary" @click="search">{{$t('common.search')}}</el-button>
      </div>
      <Pagination
        v-if="pagination.pageCount > 1"
        :pagination="pagination"
        position="top"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
      <ul v-if="loading || services.length > 0" v-loading="loading" class="service-list">
        <li v-for="service in services" :key="service.id">
          <!-- 用户信息 -->
          <div v-if="service.user != null" class="user-profile">
            <img :src="getAccessUri(service.user.avatar, '/images/avatar/default.png')">
          </div>
          <!-- 服务信息 -->
          <div class="service-info">
            <ServiceTitle
              :space="service.space.name"
              :service="service.name"
              :service-label="service.label"
            />
            <p>{{service.introduce}}</p>
            <p class="info">
              <span><i class="iconfont icon-plugin"></i>{{service.subServiceCount}} 个插件</span>
              <span>|</span>
              <span><i class="iconfont icon-time"></i>{{getDateOffsetText(service.lastPublish)}}</span>
            </p>
          </div>
        </li>
      </ul>
      <Empty v-if="keyword.trim() !== '' && services.length === 0" :description="$t('service.searchEmpty')"/>
      <Pagination
        v-if="pagination.pageCount > 1"
        :pagination="pagination"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/common/Pagination.vue";
import Empty from "@/components/common/Empty.vue";
import ServiceList from "@/components/service/ServiceList.vue";
import {search} from "@/api/service";
import ServiceTitle from "../components/service/ServiceTitle.vue";

export default {
  components: {ServiceTitle, ServiceList, Empty, Pagination},
  data () {
    return {
      loading: false,
      keyword: '',
      pagination: {
        pageIndex: 1,
        pageCount: 0,
        capacity: 20,
        total: 0
      },
      // 服务列表
      services: []
    }
  },
  methods: {
    // 搜索
    search () {
      if (this.loading) {
        return
      }
      this.loading = true
      search({
        ...this.pagination,
        model: {
          keyword: this.keyword.trim()
        }
      })
        .then(data => {
          this.pagination.total = data.total
          this.pagination.pageCount = data.pageCount
          this.services = data.records
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleSizeChange (pageSize) {
      this.pagination.capacity = pageSize
      this.search()
    },
    handleCurrentChange (value) {
      this.pagination.pageIndex = value
      this.search()
    }
  },
  created () {
    this.search()
  }
}
</script>

<style scoped lang="scss">
.page {
  height: 100%;
  overflow-y: auto;
  .warp {
    width: var(--page-width);
    margin: 30px auto 0 auto;
    padding-bottom: 50px;
    // 搜索
    .search-wrap {
      height: 75px;
      box-sizing: border-box;
      display: flex;
      border-bottom: 3px solid;
      border-image: var(--border-colors);
      margin-bottom: var(--gap-title);
      padding-bottom: var(--gap-title);
      .input-wrap {
        flex-grow: 1;
        display: flex;
        align-items: center;
        background: #f2f2f2;
        position: relative;
        .el-icon {
          position: absolute;
          top: 16px;
          left: 25px;
          z-index: 9;
        }
        .el-input {
          :deep(.el-input__wrapper) {
            padding: 0;
          }
          :deep(.el-input__inner) {
            height: 100%;
            background: #f2f2f2;
            padding: 0 20px 0 60px;
            font-size: 18px;
            font-weight: bold;
            border: 3px solid transparent;
            border-right: 0;
            &:focus {
              border-color: var(--primary-color);
            }
          }
        }
      }
      .el-input, .el-button {
        height: 100%;
      }
      .el-button {
        width: 150px;
        border-radius: 0;
        font-size: 16px;
        font-weight: bold;
      }
    }
    // 服务列表
    ul.service-list {
      width: 100%;
      min-height: 300px;
      & > li {
        padding: 15px 30px;
        box-sizing: border-box;
        background-color: var(--color-light);
        display: flex;
        justify-content: space-between;
        border-bottom: 2px solid var(--border-default-color);
        cursor: default;
      }
    }
    // 用户信息
    .user-profile {
      flex-shrink: 0;
      margin-right: 10px;
      img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        object-fit: contain;
        margin-right: 10px;
      }
    }
    // 服务信息
    .service-info {
      flex-grow: 1;
      & > h3 {
        font-size: var(--font-size-middle);
        margin-bottom: 10px;
        transition: all ease .15s;
        & > a {
          color: var(--color-service-name) !important;
          &:hover {
            color: var(--color-service-name-hover) !important;
          }
        }
      }
      & > p {
        color: var(--font-color);
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        line-height: 1.5;
        margin: 0;
      }
      & > .info {
        margin-top: 10px;
        color: var(--color-gray);
        font-size: var(--font-size-mini);
        span {
          margin-right: 15px;
        }
        .iconfont {
          font-size: 12px;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
