<template>
  <RouterView />
  <HelpCenter/>
  <!-- 文件合并窗口 -->
  <MergeWindow />
  <!-- 执行构建窗口 -->
  <BuildNotice />
</template>

<script>
import HelpCenter from "./components/common/HelpCenter.vue";
import BuildNotice from "./components/service/installer/BuildNotice.vue";
import MergeWindow from "./components/service/installer/merge/MergeWindow.vue";

export default {
  components: {MergeWindow, BuildNotice, HelpCenter}
}
</script>

<style lang="scss">
html,body {
  height: 100%;
  width: 100%;
}
#app {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
