<template>
  <ul class="kit-toolbar">
    <li @click="$refs.aiWindow.open()">
      <div class="icon-wrap" @click="$refs.aiWindow.open()">
        <Icon value="iconfont-colors icon-ai-helper3"/>
      </div>
      <span>AI助手</span>
    </li>
    <li @click="$refs.toolboxWindow.open()">
      <div class="icon-wrap">
        <ToolBoxIcon/>
      </div>
      <span>工具箱</span>
    </li>
  </ul>
  <ToolboxWindow ref="toolboxWindow"/>
  <AiWindow ref="aiWindow"/>
</template>

<script>
import ToolBoxIcon from '@/components/tools/toolbox/ToolBoxIcon'
import ToolboxWindow from '@/components/tools/toolbox/ToolboxWindow'
import AiWindow from '@/components/tools/ai/AiWindow';

export default {
  name: 'Toolbar',
  components: { AiWindow, ToolBoxIcon, ToolboxWindow }
}
</script>

<style scoped lang="scss">
.kit-toolbar {
  position: fixed;
  right: 50px;
  bottom: 50px;
  z-index: 98;
  background: rgba(255, 255, 255, .95);
  padding: 20px 10px;
  border-radius: 10px;
  box-shadow: 0 0 10px -5px rgba(0, 0, 0, .25);
  display: flex;
  flex-direction: column;
  gap: 15px;
  li {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    &:hover {
      .icon-wrap {
        transform: scale(1.08);
      }
    }
    .icon-wrap {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      overflow: hidden;
      transition: all ease .15s;
      display: flex;
      align-items: center;
      justify-content: center;
      :deep(.icon) {
        font-size: 40px !important;
      }
    }
    span {
      margin-top: 5px;
    }
  }
}
</style>
