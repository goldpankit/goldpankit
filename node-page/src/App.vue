<script setup>
// import { RouterLink, RouterView } from 'vue-router' // 跳转页面
</script>

<template>
  <div id="app" class="theme-light">
    <RouterView />
  </div>
</template>

<style scoped lang="scss">
html,body {
  height: 100%;
  width: 100%;
}
#app {
  width: 100%;
  height: 100vh;
}
</style>
