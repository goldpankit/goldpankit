<template>
  <el-radio-group v-model="$i18n.locale">
    <el-radio-button label="en">English</el-radio-button>
    <el-radio-button label="zh">简体中文</el-radio-button>
  </el-radio-group>
  <template v-if="userInfo == null">
    <el-button @click="$router.push({ name: 'SignIn' })">Sign In</el-button>
    <el-button type="important" @click="$router.push({ name: 'SignUp' })">Sign Up</el-button>
  </template>
  <template v-else>
    <div class="bean-wrap">
      <img src="/images/bean.png">
      <em>{{userInfo.balance.total}}</em>
    </div>
    <div class="user-info" @click="$router.push({ name: 'Index'})">
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
