<template>
  <ToolWindow
    title="AI助手"
    v-model="visible"
  >
    <iframe src="http://agent.goldpankit.com/agent/kit-doc?prologue=%E6%9C%89%E5%85%B3GoldPanKit%E7%9A%84%E9%97%AE%E9%A2%98%EF%BC%8C%E5%B0%B1%E5%90%91%E6%88%91%E6%8F%90%E9%97%AE%E5%90%A7%EF%BD%9E&replyTip=%E6%AD%A3%E5%9C%A8%E6%A3%80%E7%B4%A2%EF%BC%8C%E8%AF%B7%E7%A8%8D%E5%90%8E...&placeholder=GoldPanKit%E7%9A%84%E7%94%A8%E9%80%94%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F"></iframe>
  </ToolWindow>
</template>

<script>
import ToolWindow from '@/components/tools/ToolWindow'
import BaseToolWindow from '@/components/tools/BaseToolWindow'

export default {
  name: 'AiWindow',
  extends: BaseToolWindow,
  components: { ToolWindow }
}
</script>

<style scoped lang="scss">
iframe {
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
