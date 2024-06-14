<template>
  <div class="page">
    <div class="warp">
      <div class="search-wrap">
        <div class="input-wrap">
          <el-icon size="20"><Search/></el-icon>
          <el-input
            v-model="keyword"
            size="large"
            :placeholder="$t('space.searchPlaceholder')"
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
      <ul v-if="loading || spaces.length > 0" v-loading="loading" class="space-list">
        <li v-for="space in spaces" :key="space.id">
          <a
            href="javascript:;"
            @click="$router.push({ name: 'SpaceDetail', params: { name: space.name } })"
          >
            <h3>{{space.name}}</h3>
            <p>{{space.introduce}}</p>
            <!-- 服务列表 -->
            <ServiceList
              :services="space.mainServices"
              @select="$router.push({
                name: 'ServiceDetail',
                params: { spaceName: space.name, serviceName: $event.name }
              })"
            />
            <!-- 用户信息 -->
            <div v-if="space.user != null" class="user-profile">
              <Avatar :file-key="space.user.avatar" size="30px" margin="0 10px 0 0"/>
              <span>{{space.user.username}}</span>
            </div>
          </a>
        </li>
      </ul>
      <Empty v-if="keyword.trim() !== '' && spaces.length === 0" :description="$t('space.searchEmpty')"/>
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
import {search} from "../api/service.space";
import Pagination from "../components/common/Pagination.vue";
import Empty from "../components/common/Empty.vue";
import ServiceList from "../components/service/ServiceList.vue";

export default {
  components: {ServiceList, Empty, Pagination},
  data () {
    return {
      loading: false,
      keyword: '',
      pagination: {
        pageIndex: 1,
        pageCount: 0,
        capacity: 15,
        total: 0
      },
      spaces: []
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
          this.spaces = data.records
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
    h2 {
      font-size: var(--font-size-title);
      margin-bottom: var(--gap-title);
      border-bottom: 3px solid;
      border-image: var(--border-colors);
      padding-bottom: 10px;
    }
    .search-wrap {
      height: 75px;
      box-sizing: border-box;
      display: flex;
      border-bottom: 3px solid;
      border-image: var(--border-colors);
      margin-bottom: var(--gap-title);
      padding-bottom: 10px;
      .input-wrap {
        flex-grow: 1;
        display: flex;
        align-items: center;
        background: #f2f2f2;
        position: relative;
        .el-icon {
          position: absolute;
          top: 20px;
          left: 30px;
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
    // 空间列表
    ul.space-list {
      width: 100%;
      min-height: 300px;
      & > li {
        padding: 30px 30px;
        box-sizing: border-box;
        background-color: var(--color-light);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: var(--font-size-middle);
        border-bottom: 2px solid var(--border-default-color);
        border-left: 5px solid;
        border-left-color: var(--primary-color);
        &:nth-of-type(2n) {
          border-left-color: var(--primary-color-match-2);
        }
        &:nth-of-type(3n) {
          border-left-color: var(--primary-color-match-1);
        }
        &:hover {
          h3 {
            color: var(--primary-color-match-2);
            text-decoration: underline;
          }
        }
        & > h3 {
          font-size: var(--font-size-large);
          margin-bottom: 15px;
        }
        a > p {
          color: var(--font-color);
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          line-height: 25px;
          margin: 10px 0;
        }
      }
    }
    // 服务列表
    //ul.service-list {
    //  margin-top: 10px;
    //  display: flex;
    //  flex-wrap: wrap;
    //  & > li {
    //    margin-right: 10px;
    //    width: 325px;
    //    border: 2px solid var(--border-default-color);
    //    padding: 20px;
    //    cursor: pointer;
    //    margin-bottom: 15px;
    //    transition: all ease .15s;
    //    &:hover {
    //      background: var(--background-color);
    //      border-color: var(--border-default-color-deep)
    //    }
    //    h4 {
    //      font-size: var(--font-size-middle);
    //      margin-bottom: 10px;
    //    }
    //    & > p {
    //      font-size: var(--font-size);
    //    }
    //    .infos {
    //      display: flex;
    //      margin-top: 10px;
    //      font-size: var(--font-size-mini);
    //      p {
    //        margin-right: 10px;
    //      }
    //    }
    //    .opera {
    //      display: flex;
    //      justify-content: flex-end;
    //    }
    //  }
    //}
    // 用户信息
    .user-profile {
      display: flex;
      align-items: center;
    }
  }
}
</style>
