<template>
  <div class="inner-router-view-window">
    <div class="nav">
      <div class="title">
        <el-button v-if="histories.length > 1" class="button-icon" icon="ArrowLeftBold" @click="back"></el-button>
        <h4>{{currentView.title}}/{{currentView.name}}</h4>
      </div>
    </div>
    <div class="routers">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import InnerRouterView from "./InnerRouterView.vue";

export default {
  name: "InnerRouterViewWindow",
  components: {InnerRouterView},
  data () {
    return {
      // 当前视图名称
      currentViewName: '',
      // 视图集合
      views: [],
      // 视图切换历史
      histories: []
    }
  },
  computed: {
    currentView () {
      return this.views.find(v => v.props.name === this.currentViewName).props
    }
  },
  methods: {
    // 跳转
    push (viewName) {
      this.histories.push(viewName)
      this.currentViewName = viewName
    },
    // 返回
    back () {
      this.histories.pop()
      this.currentViewName = this.histories[this.histories.length - 1]
    },
    // 获取默认view
    __getDefaultView () {
      let defaultView = this.views.find(v => v.props.default)
      if (defaultView == null) {
        defaultView = this.views[0].props.name
      }
      return defaultView
    }
  },
  created () {
    this.views = this.$slots.default()
    this.currentViewName = this.__getDefaultView()
    this.histories = [this.currentViewName]
  }
}
</script>

<style scoped lang="scss">
.inner-router-view-window {
  padding: 0 20px;
}
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .title {
    align-items: center;
    display: flex;
    .el-button {
      border: 0;
    }
    h4 {
      font-size: var(--font-size-middle);
    }
  }
}
</style>
