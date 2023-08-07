<template>
  <div class="page">
    <div class="banner">
      <div class="wrap">
        <h2>Gold Pan Kit</h2>
        <p>{{$t('guide.kitIntroduce')}}</p>
        <p class="description">{{$t('guide.kitDescription')}}</p>
        <div class="opera">
          <el-button @click="$router.push({name: 'SignUp'})" type="important">{{$t('common.signUp')}}</el-button>
          <el-button type="primary" @click="$router.push({name: 'PublicSpaces'})">{{$t('guide.goToServiceSpaces')}}</el-button>
        </div>
      </div>
      <span class="emb">G</span>
      <span class="emb service">{{$t('guide.selectService2')}}</span>
      <span class="emb install">{{$t('service.install')}}</span>
      <span class="emb done">{{$t('guide.completed')}}</span>
    </div>
    <div class="content">
      <div class="wrap">
        <h3>{{$t('guide.start')}}</h3>
        <ul>
          <li>
            <h4>i. {{$t('guide.selectService')}}</h4>
            <p>{{$t('guide.serviceIntroduce')}}</p>
          </li>
          <li>
            <h4>ii. {{$t('guide.installService')}}</h4>
            <p>{{$t('guide.installIntroduce')}}</p>
          </li>
        </ul>
        <div class="opera">
          <el-button type="primary" size="large"  @click="$router.push({name: 'PublicSpaces'})">{{$t('guide.goToServiceSpaces')}}</el-button>
        </div>
      </div>
    </div>
    <footer>
      {{$t('common.currentVersion')}}: v{{version}}
    </footer>
  </div>
</template>

<script>

import {fetchVersion} from "../api/client";

export default {
  name: "guide",
  data () {
    return {
      version: ''
    }
  },
  methods: {
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
.page {
  height: 100%;
  overflow-y: auto;
}
.banner {
  height: 800px;
  animation: changeBackground 10s ease-in-out infinite alternate;
  background: #FC777D;
  position: relative;
  overflow: hidden;
  .wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: var(--color-light);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9;
    .opera {
      margin-top: 50px;
      .el-button {
        width: 245px;
        height: 60px;
        font-size: 18px;
        border-radius: 100px;
        margin-right: 20px;
        &:last-of-type {
          margin-right: 0;
        }
      }
    }
  }
  h2 {
    font-size: 75px;
    margin-bottom: 20px;
    text-shadow: 0 0 5px #ab5155;
  }
  p {
    font-size: var(--font-size-large);
    letter-spacing: 1px;
    width: 800px;
    text-align: center;
    margin-bottom: 15px;
    line-height: 30px;
    &.description {
      width: 600px;
      font-size: var(--font-size-middle);
    }
  }
  .emb {
    transform: rotate(45deg);
    position: absolute;
    left: 150px;
    top: 120px;
    font-size: 395px;
    color: #c46165;
    font-family: fantasy;
    font-weight: bold;
    &.service {
      font-size: 50px;
      left: 450px;
      top: 100px;
      transform: none;
      color: #502829;
    }
    &.install {
      font-size: 50px;
      left: 800px;
      top: initial;
      bottom: 50px;
      transform: none;
      color: #773c3e;
    }
    &.done {
      font-size: 50px;
      left: 1050px;
      top: initial;
      bottom: 200px;
      transform: none;
      color: #a25154;
    }
  }
}
.content {
  background: var(--color-light);
  .wrap {
    width: var(--page-width);
    margin: 0 auto;
    padding: var(--gap-page-padding);
    h3 {
      margin-top: 50px;
      text-align: center;
      font-size: 50px;
    }
    h4 {
      font-size: 25px;
    }
    ul {
      margin: 30px 0;
      li {
        margin-bottom: 30px;
        p {
          margin-top: 20px;
        }
      }
    }
    p {
      font-size: 20px;
    }
    .opera {
      display: flex;
      justify-content: center;
      margin-top: 100px;
      .el-button {
        width: 255px;
        height: 80px;
        font-size: 20px;
      }
    }
  }
}
footer {
  display: flex;
  justify-content: center;
  padding: 50px;
  background: var(--background-color);
}
@keyframes changeBackground {
  0%   { background-color: #FC777D; }
  100% { background-color: #2d1516; }
}
</style>
