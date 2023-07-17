<template>
  <template v-if="userInfo == null">
    <el-button @click="$router.push({ name: 'Login' })">Sign In</el-button>
    <el-button type="important" @click="$router.push({ name: 'SignUp' })">Sign Up</el-button>
  </template>
  <template v-else>
    <div class="user-info" @click="$router.push({ name: 'Index'})">
      <img
        v-if="userInfo.avatar == null || userInfo.avatar === ''"
        src="/images/avatar/1.png"
        class="avatar"
      >
      <img v-else :src="userInfo.avatar" class="avatar"/>
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
