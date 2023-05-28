<template>
  <div class="page">
    <div class="warp">
      <h2>Public Spaces</h2>
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
                <div class="opera">
                  <el-button size="small" @click="$router.push({ name: 'ServiceSettings', query: { service_id: service.id } })">Edit</el-button>
                </div>
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
    }
    // 空间列表
    ul.space-list {
      width: 100%;
      box-shadow: var(--page-shadow);
      & > li {
        margin-bottom: 20px;
        padding: 50px 30px;
        box-sizing: border-box;
        background-color: var(--color-light);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: var(--font-size-middle);
        border-radius: 30px;
        h3 {
          font-size: var(--font-size-title);
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
        border: 1px solid var(--border-default-color);
        padding: 20px;
        cursor: pointer;
        margin-bottom: 15px;
        border-radius: 10px;
        transition: all ease .15s;
        &:hover {
          // border-color: var(--primary-color);
          background: var(--background-color);
        }
        h4 {
          font-size: var(--font-size-middle);
          margin-bottom: 10px;
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
