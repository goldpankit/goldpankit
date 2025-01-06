<template>
  <div class="tool-router">
    <div class="router-view">
      <component ref="component" :is="component" @on-rendered="onRendered"/>
    </div>
    <div v-if="developers.length > 0" class="router-footer">
      <Developers :data="developers"/>
    </div>
  </div>
</template>

<script>

import JsonFormatter from './json-formatter/index.vue'
import NameGenerator from './name-generator/index.vue'
import PasswordGenerator from './password-generator/index.vue'
import TextComparer from './text-comparer/index.vue'
import Empty from '@/components/common/Empty.vue'
import Developers from "@/components/common/Developers.vue";
export default {
  name: 'ToolRouter',
  components: {
    Developers,
    Empty,
    JsonFormatter,
    NameGenerator,
    PasswordGenerator,
    TextComparer
  },
  props: {
    // 工具名称
    toolName: {
      required: true
    }
  },
  data () {
    return {
      developers: []
    }
  },
  computed: {
    component () {
      let targetComponent = this.$options.components[this.toolName]
      if (targetComponent == null) {
        targetComponent = Empty
      }
      return targetComponent
    }
  },
  watch: {
    // 切换工具时，重置开发者列表
    component () {
      this.developers = []
    }
  },
  methods: {
    // 全屏切换时，触发工具的事件处理
    onSwitchFullscreen (fullscreen) {
      this.$refs.component.onSwitchFullscreen && this.$refs.component.onSwitchFullscreen(fullscreen)
    },
    // 工具已渲染
    onRendered () {
      this.developers = this.$refs.component.developers
    }
  }
}
</script>

<style scoped lang="scss">
.tool-router {
  height: 100%;
  display: flex;
  flex-direction: column;
  .router-view {
    flex-grow: 1;
    overflow: hidden;
    background-color: var(--background-color);
  }
  .router-footer {
    flex-shrink: 0;
    background-color: #eee;
  }
}
</style>
