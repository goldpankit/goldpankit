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
import { mapState, mapActions } from 'vuex'
import HelpCenter from "./components/common/HelpCenter.vue";
import BuildNotice from "./components/service/installer/BuildNotice.vue";
import MergeWindow from "./components/service/installer/merge/MergeWindow.vue";
import Toolbar from "./components/tools/Toolbar.vue";
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'

export default {
  components: {Toolbar, MergeWindow, BuildNotice, HelpCenter},
  computed: {
    ...mapState(['currentProjectDetail', 'currentDatabase', 'globalLoading']),
    locale () {
      const i18nLocal = this.$i18n.locale
      if (i18nLocal === 'en') {
        return en
      }
      return zhCn
    }
  },
  watch: {
    // 当前项目变化时，重新加载数据库列表
    currentProjectDetail () {
      this.fetchDatabases()
        .catch(() => {})
    },
    // 切换数据库时，重新加载表集合，加载表结合会自动更新模型集合
    currentDatabase () {
      this.fetchTables()
        .catch(() => {})
    },
    // 数据库列表加载完成后，如果存在选中的数据库，则获取表集合
    'globalLoading.databases' () {
      if (!this.globalLoading.databases && this.currentDatabase != null) {
        this.fetchTables()
          .catch(() => {})
      }
    }
  },
  methods: {
    ...mapActions(['fetchDatabases', 'fetchTables'])
  },
  created () {
    // 进入系统时查询数据库列表
    this.fetchDatabases()
      .then(() => {
        // 数据库加载完成后，获取数据库表（如果当前选择了数据库），获取数据库时会自动更新模型集合
        this.fetchTables()
          .catch(() => {})
      })
      .catch(() => {})
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
