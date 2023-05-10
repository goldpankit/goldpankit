<template>
  <div class="page">
    <div class="wrap">
      <div class="header">
        <h2>Eva for SpringBoot Services</h2>
        <div class="opera">
          <el-button type="primary" @click="$router.push({ name: 'CreateService' })">Create New Service</el-button>
        </div>
      </div>
      <div class="search-wrap">
        <el-input size="large" placeholder="type here and press enter."/>
      </div>
      <Pagination :pagination="pagination"/>
      <ul class="service-list">
        <li v-for="i in 10" :key="i">
          <div class="info">
            <h3>支付宝支付</h3>
            <p>对接支付宝支付</p>
          </div>
          <ul>
            <li><el-button>View Logic</el-button></li>
          </ul>
        </li>
      </ul>
      <Pagination :pagination="pagination"/>
    </div>
  </div>
</template>

<script>
import Pagination from "../../components/common/Pagination.vue";

export default {
  components: {Pagination},
  data () {
    return {
      pagination: {
        page: 1,
        capacity: 10,
        total: 100
      }
    }
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
      background-color: #fff;
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
