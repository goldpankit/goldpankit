<template>
  <div class="page">
    <div class="warp">
      <h2>Public Spaces</h2>
      <ul>
        <li v-for="space in spaces" :key="space.id">
          <router-link :to="{ name: 'SpaceDetail', query: { space_id: space.id } }">
            <h3>{{space.name}}</h3>
            <p>{{space.description}}</p>
            <p class="tech-stack">Java · SpringBoot · MyBatisPlus · MySQL</p>
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
    search () {
      search()
        .then(data => {
          this.spaces = data
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
    ul {
      width: 100%;
      li {
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
        .tech-stack {
          margin-top: 10px;
          color: #747474;
          font-weight: 400;
        }
      }
    }
  }
}
</style>
