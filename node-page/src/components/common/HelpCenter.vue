<template>
  <el-drawer
    :model-value="visibleHelpDialog"
    size="650px"
    title="Kit Help Center"
    modal-class="help-drawer"
    @close="setHelpCode(null)"
  >
    <div class="search-wrap">
      <el-input/>
      <el-button type="primary" >Search</el-button>
    </div>
    <div class="content">
      <span>help code: {{help.code}}</span>
    </div>
  </el-drawer>
</template>

<script>

import {mapMutations, mapState} from "vuex";

export default {
  name: "HelpCenter",
  computed: {
    ...mapState(['help']),
    visibleHelpDialog () {
      return this.help.code != null
    }
  },
  methods: {
    ...mapMutations(['setHelpCode'])
  }
}
</script>

<style lang="scss">
.help-drawer {
  .el-drawer__body {
    padding: 0 20px;
  }
  .search-wrap {
    width: 450px;
    display: flex;
    .el-button {
      margin-left: 10px;
    }
  }
  .content {
    margin-top: 10px;
  }
}
</style>
