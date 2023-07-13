<template>
  <div class="page">
    <div class="warp">
<!--      <h2>Public Spaces</h2>-->
      <div class="search-wrap">
        <div class="input-wrap">
          <el-icon size="20"><Search/></el-icon>
          <el-input size="large" placeholder="Search spaces & services"></el-input>
        </div>
        <el-button size="large" type="primary">Search</el-button>
      </div>
      <ul class="space-list">
        <li v-for="space in spaces" :key="space.id">
          <router-link :to="{ name: 'SpaceDetail', params: { name: space.name } }">
            <h3>{{space.name}}</h3>
            <p>{{space.description}}</p>
            <ul class="service-list">
              <li v-for="service in space.frameworkServices">
                <h4>{{service.name}}</h4>
                <p>{{service.description}}</p>
                <section class="infos">
                  <p>21 sub versions</p>
                  <p>Latest version: 2.2.0</p>
                </section>
                <section class="infos text-info-1">
                  <p>Last publish: 3 weeks ago</p>
                </section>
              </li>
            </ul>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {search} from "../../api/service.space";

export default {
  data () {
    return {
      spaces: []
    }
  },
  methods: {
    // 搜索
    search () {
      search({
        name: ''
      })
        .then(data => {
          this.spaces = data.records
        })
        .catch(e => {
          console.log('e', e)
        })
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
            font-size: 16px;
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
      }
    }
    // 空间列表
    ul.space-list {
      width: 100%;
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
        h3 {
          font-size: var(--font-size-large);
          margin-bottom: 15px;
        }
        p {
          color: var(--font-color);
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2;
          display: -webkit-box;
          -webkit-box-orient: vertical;
        }
      }
    }
    // 服务列表
    ul.service-list {
      margin-top: 10px;
      display: flex;
      flex-wrap: wrap;
      & > li {
        margin-right: 10px;
        width: 325px;
        border: 2px solid var(--border-default-color);
        padding: 20px;
        cursor: pointer;
        margin-bottom: 15px;
        transition: all ease .15s;
        &:hover {
          background: var(--background-color);
          border-color: var(--border-default-color-deep)
        }
        h4 {
          font-size: var(--font-size-middle);
          margin-bottom: 10px;
        }
        & > p {
          font-size: var(--font-size);
        }
        .infos {
          display: flex;
          margin-top: 10px;
          font-size: var(--font-size-mini);
          p {
            margin-right: 10px;
          }
        }
        .opera {
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }
}
</style>
