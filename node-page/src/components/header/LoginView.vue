<template>
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
    <div class="user-info" @click="$router.push({ name: 'Desktop'})">
      <Avatar :file-key="userInfo.avatar" size="30px"/>
    </div>
  </template>
</template>

<script>

import {mapState} from "vuex";
import I18nLangSelect from "../common/I18nLangSelect.vue";

export default {
  name: "LoginView",
  components: {I18nLangSelect},
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
.user-info {
  margin-left: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}
</style>
