<template>
  <component ref="component" :is="component"/>
</template>

<script>

import JsonFormatter from './json-formatter/Index.vue'
import Empty from "@/components/common/Empty.vue";
export default {
  name: 'ToolRouter',
  components: {
    Empty,
    JsonFormatter
  },
  props: {
    // 工具名称
    toolName: {
      required: true
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
  methods: {
    // 触发具体实现的方法
    onSwitchFullscreen (fullscreen) {
      this.$refs.component.onSwitchFullscreen && this.$refs.component.onSwitchFullscreen(fullscreen)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
