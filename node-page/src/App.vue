<template>
  <div id="app">
    <RouterView />
    <HelpCenter/>
  </div>
</template>

<script>
import HelpCenter from "./components/common/HelpCenter.vue";

export default {
  components: {HelpCenter}

}
</script>

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
