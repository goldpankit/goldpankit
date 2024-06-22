<template>
  <el-dialog
    class="query-model-window"
    v-model="visible"
    fullscreen
    append-to-body
    :show-close="false"
  >
    <template #header>
      <h2>查询模型设计</h2>
      <div class="header__opera">
        <DataSourceSelect :model-value="currentDatabase"/>
        <el-icon @click="close"><Close /></el-icon>
      </div>
    </template>
    <QueryModelView :database-id="currentDatabase"/>
  </el-dialog>
</template>

<script>

import QueryModelView from "./QueryModelView.vue";
import DataSourceSelect from "../DataSourceSelect.vue";
import {mapState} from "vuex";

export default {
  name: "QueryModelWindow",
  components: {DataSourceSelect, QueryModelView},
  data () {
    return {
      visible: false
    }
  },
  computed: {
    ...mapState(['currentDatabase'])
  },
  methods: {
    open () {
      this.visible = true
    },
    close () {
      this.visible = false
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.query-model-window {
  padding: 0;
  min-width: 1000px;
  display: flex;
  flex-direction: column;
  //width: 98% !important;
  //height: 98% !important;
  //top: 1%;

  .el-dialog__header {
    --header-height: 55px;
    background: var(--background-color);
    margin-right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 !important;
    flex-shrink: 0;
    height: var(--header-height);
    // 标题
    h2 {
      font-weight: normal;
      font-size: var(--font-size-large);
      padding-left: 20px;
    }
    // 操作
    .header__opera {
      display: flex;
      align-items: center;
      & > .el-icon {
        width: var(--header-height);
        height: var(--header-height);
        margin-left: 30px;
        font-size: 30px;
        background: var(--primary-color-match-2);
        color: var(--color-light);
        transition: all ease .15s;
        display: flex;
        align-items: center;
        justify-content: center;
        svg {
          transition: all ease .15s;
        }
        &:hover {
          svg {
            transform: scale(1.2);
          }
        }
      }
    }
  }

  .el-dialog__body {
    padding: 0 !important;
    flex-grow: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
}
</style>
