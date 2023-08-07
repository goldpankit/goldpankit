<template>
  <el-radio-group class="i18n" v-model="$i18n.locale">
    <el-radio-button label="en">English</el-radio-button>
    <el-radio-button label="zh">简体中文</el-radio-button>
  </el-radio-group>
  <template v-if="userInfo == null">
    <el-button @click="$router.push({ name: 'SignIn' })">{{$t('common.signIn')}}</el-button>
    <el-button type="important" @click="$router.push({ name: 'SignUp' })">{{$t('common.signUp')}}</el-button>
    <div class="menu" @click="$router.push({ name: 'Desktop' })">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </template>
  <template v-else>
    <div class="bean-wrap">
      <img src="/images/bean.png">
      <em>{{userInfo.balance.total}}</em>
    </div>
    <div class="user-info" @click="$router.push({ name: 'Desktop'})">
      <img :src="getAccessUri(userInfo.avatar, '/images/avatar/default.png')" class="avatar"/>
    </div>
  </template>
</template>

<script>

import {mapState} from "vuex";

export default {
  name: "LoginView",
  computed: {
    ...mapState(['userInfo'])
  }
}
</script>

<style scoped lang="scss">
.i18n {
  margin-right: 15px;
}
.menu {
  width: 30px;
  height: 30px;
  margin-left: 30px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-content: space-between;
  flex-wrap: wrap;
  border-radius: 50%;
  overflow: hidden;
  &:hover {
    span {
      width: 13px;
      height: 13px;
    }
  }
  span {
    width: 15px;
    height: 15px;
    background: var(--primary-color);
    transition: all ease .15s;
    &:nth-of-type(2) {
      background: var(--primary-color-match-2);
    }
    &:nth-of-type(3) {
      background: var(--primary-color-match-1);
    }
    &:nth-of-type(4) {
      background: #999;
    }
  }
}
.bean-wrap {
  margin-left: 30px;
  margin-right: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  img {
    width: 20px;
  }
  em {
    font-style: normal;
    font-weight: bold;
    margin-left: 2px;
  }
}
.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  img {
    width: 30px;
    height: 30px;
    object-fit: contain;
    border-radius: 50%;
  }
}
</style>
