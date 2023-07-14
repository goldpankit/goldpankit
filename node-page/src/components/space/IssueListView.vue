<template>
  <div class="issue-wrap">
    <div class="toolbar">
      <ul>
        <li>All</li>
        <li>Enabled</li>
        <li>Completed</li>
        <li>Refused</li>
      </ul>
      <ul class="issue-types">
        <li class="bug">BUG</li>
        <li class="optimize">Optimize</li>
      </ul>
    </div>
    <ul class="issues">
      <li v-for="i in 10" :key="i">
        <router-link to="#" target="_blank">
          <h3>登录失败时验证码没有刷新</h3>
          <ul>
            <li class="text-info-1">
              <el-icon><UserFilled /></el-icon>
              <span>刘大逵</span>
            </li>
            <li class="text-info-1">
              <span>Completed</span>
            </li>
            <li class="text-info-1">
              <span>3小时前</span>
            </li>
          </ul>
        </router-link>
      </li>
    </ul>
    <Pagination :pagination="pagination"/>
  </div>
</template>

<script>

import Pagination from "../common/Pagination.vue";

export default {
  name: "IssueListView",
  components: {Pagination},
  data () {
    return {
      pagination: {
        pageIndex: 1,
        capacity: 10,
        total: 100
      }
    }
  }
}
</script>

<style scoped lang="scss">
.issue-wrap {
  --bug-color: #fc5f3a;
  --optimize-color: #1f70d9;
  .toolbar {
    background: var(--background-color);
    display: flex;
    justify-content: space-between;
    ul {
      display: flex;
    }
    li {
      text-align: center;
      padding: 10px 20px;
      cursor: default;
      opacity: .75;
      &:hover {
        opacity: 1;
      }
    }
    .issue-types {
      font-weight: bold;
    }
    .bug {
      color: var(--bug-color);
    }
    .optimize {
      color: var(--optimize-color);
    }
  }
  .issues {
    padding: 20px 0 0 20px;
    & > li {
      display: flex;
      margin-bottom: 10px;
      padding-left: 15px;
      position: relative;
      border-bottom: 1px dashed var(--border-default-color);
      padding-bottom: 10px;
      &::before {
        content: '';
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--bug-color);
        position: absolute;
        left: 0;
        top: 8px;
      }
      & > a {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        ul {
          display: flex;
          flex-shrink: 0;
          margin-left: 20px;
        }
        li {
          display: flex;
          align-items: center;
          &::after {
            content: '·';
            margin: 0 5px;
          }
          &:last-of-type::after {
            content: '';
          }
          .el-icon {
            margin-right: 5px;
          }
        }
        &:hover {
          h3 {
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>
