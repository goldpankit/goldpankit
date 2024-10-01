<template>
  <JsonFormatter v-if="toolName === 'json-formatter'"/>
  <Empty v-else description="待实现"/>
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
  }
}
</script>

<style scoped lang="scss">

</style>
