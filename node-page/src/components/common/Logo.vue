<template>
  <div class="logo" @click="go2home">
    <div class="logo-wrap">
      <h1>Gold Pan Kit</h1>
      <div class="decoration" :class="{ 'no-animation': !withAnimation }">
        <em></em>
        <i v-if="withAnimation">一分钟搭建框架</i>
      </div>
    </div>
    <div v-if="withVersion" class="version">
      v{{ version }}
    </div>
    <ul class="online-wrap">
      <li>
        <a href="http://www.goldpankit.com" target="_blank" @click.stop>访问线上版本</a>
      </li>
      <li>
        <a href="https://www.yuque.com/u21334242/goldpankit/eauwiag8k720gcr8" target="_blank" @click.stop>查看使用文档</a>
      </li>
    </ul>
  </div>
</template>

<script>

import {fetchVersion} from "@/api/client";

export default {
  name: 'Logo',
  props: {
    withVersion: {
      default: true
    },
    withAnimation: {
      default: false
    }
  },
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
      background-color: var(--primary-color-match-1);
      border: 2px solid var(--primary-color-match-1);
      display: flex;
      justify-content: center;
      margin-top: 2px;
      position: relative;
      em {
        position: absolute;
        top: 0;
        left: 0;
        width: 50px;
        height: 100%;
        background-color: var(--primary-color);
        box-sizing: border-box;
        transform: translateX(20px);
        border-radius: 10px;
        animation: loop 5s linear infinite;
      }
      i {
        height: 100%;
        font-size: var(--font-size-small);
        transform: scale(0.6);
        color: var(--primary-color-match-1);
        position: relative;
        top: -2px;
      }
      &.no-animation {
        em {
          animation: none;
        }
      }
    }
  }
  .version {
    margin-left: 15px;
    font-style: italic;
    cursor: pointer;
  }
  .online-wrap {
    display: flex;
    li {
      margin-left: 15px;
    }
    a {
      font-weight: bold;
      text-decoration: underline !important;
    }
  }
}
@keyframes loop {
  0% {
    transform: translateX(0px);
  }
  50% {
    transform: translateX(106px);
  }
  100% {
    transform: translateX(0px);
  }
}
</style>
