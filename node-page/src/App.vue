<template>
  <el-config-provider :locale="locale">
    <RouterView />
    <HelpCenter/>
    <!-- 文件合并窗口 -->
    <MergeWindow />
    <!-- 执行构建窗口 -->
    <BuildNotice />
    <!-- 工具条 -->
    <Toolbar/>
  </el-config-provider>
</template>

<script>
import HelpCenter from "./components/common/HelpCenter.vue";
import BuildNotice from "./components/service/installer/BuildNotice.vue";
import MergeWindow from "./components/service/installer/merge/MergeWindow.vue";
import Toolbar from "./components/tools/Toolbar.vue";
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
export default {
  components: {Toolbar, MergeWindow, BuildNotice, HelpCenter},
  computed: {
    locale () {
      const i18nLocal = this.$i18n.locale
      if (i18nLocal === 'en') {
        return en
      }
      return zhCn
    }
  }
}
</script>

<style lang="scss">
html,body {
  height: 100%;
  width: 100%;
  overflow: auto !important;
}
#app {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  min-width: 1300px;
}
</style>
