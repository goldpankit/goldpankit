<template>
  <div class="logo" @click="go2home">
    <div class="logo-wrap">
      <h1>Gold Pan Kit</h1>
      <div class="decoration">
        <em></em>
        <em></em>
      </div>
    </div>
    <div class="version">
      v{{ version }}
    </div>
  </div>
</template>

<script>

import {fetchVersion} from "@/api/client";

export default {
  name: 'Logo',
  data () {
    return {
      version: ''
    }
  },
  methods: {
    // 跳转至首页
    go2home () {
      window.open('/services')
    },
    // 获取版本号
    fetchVersion () {
      fetchVersion()
        .then((data) => {
          this.version = data
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    }
  },
  created () {
    this.fetchVersion()
  }
}
</script>

<style scoped lang="scss">
.logo {
  display: flex;
  align-items: center;
  .logo-wrap {
    cursor: pointer;
    width: 160px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    h1 {
      font-size: var(--font-size-large);
      font-style: italic;
      display: inline-block;
      position: relative;
      padding: 0 10px;
    }
    .decoration {
      width: 160px;
      height: 15px;
      background-color: var(--primary-color);
      border: 1px solid var(--primary-color);
      display: flex;
      justify-content: space-between;
      em {
        width: 80px;
        height: 100%;
        background-color: var(--primary-color-match-1);
        box-sizing: border-box;
        &:first-of-type {
          width: 10px;
        }
      }
    }
  }
  .version {
    margin-left: 15px;
    font-style: italic;
  }
}
</style>
