<template>
  <div class="page">
    <div class="wrap">
      <div class="header">
        <h2>Leased and private services</h2>
      </div>
      <div class="search-wrap">
        <el-input size="large" placeholder="type here and press enter."/>
      </div>
      <ul class="service-list">
        <li v-for="service in services" :key="service.id">
          <div class="info">
            <h3>@Ruoyi/{{service.name}}</h3>
            <p>{{service.introduce}}</p>
            <p>代码空间: </p>
            <p>代码仓库: {{service.repository}}</p>
            <p>最后发布于: </p>
            <p>作者：</p>
          </div>
          <ul>
            <li><el-button>Code</el-button></li>
            <li><el-button text type="danger">Delete</el-button></li>
          </ul>
        </li>
      </ul>
      <Pagination :pagination="pagination"/>
    </div>
  </div>
</template>

<script>
import Pagination from "../../components/common/Pagination.vue";
import {fetchPage} from "../../api/user.service";

export default {
  components: {Pagination},
  data () {
    return {
      pagination: {
        page: 1,
        capacity: 10,
        total: 100
      },
      services: []
    }
  },
  methods: {
    // 查询分页
    fetchPage () {
      fetchPage({
        ...this.pagination,
        model: {}
      })
        .then(data => {
          this.services = data.records
          this.pagination.total = data.total
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
      display: flex;
      border-bottom: 1px solid var(--border-default-color);
      &:last-of-type {
        border-bottom: 0;
      }
      .info {
        flex-grow: 1;
        h3 {
          font-size: var(--font-size-middle);
          margin-bottom: 10px;
        }
        p {
          font-size: var(--font-size);
        }
      }
      ul {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        margin-left: 30px;
      }
    }
  }
}
</style>
