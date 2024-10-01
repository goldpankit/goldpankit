<template>
  <ul class="kit-toolbar">
<!--    <li>-->
<!--      <div class="icon-wrap" @click="$refs.aiWindow.open()">-->
<!--        <AIIcon/>-->
<!--      </div>-->
<!--      <span>{{$t('tool.ai.name')}}</span>-->
<!--    </li>-->
    <li>
      <div class="icon-wrap">
        <ToolBoxIcon @click="$refs.toolboxWindow.open()"/>
      </div>
      <span>工具箱</span>
    </li>
  </ul>
  <ToolboxWindow ref="toolboxWindow"/>
<!--  <AIWindow ref="aiWindow"/>-->
</template>

<script>
import AIIcon from "./ai/AIIcon.vue";
import ToolBoxIcon from "@/components/tools/toolbox/ToolBoxIcon";
import ToolboxWindow from "@/components/tools/toolbox/ToolboxWindow";

export default {
  name: 'Toolbar',
  components: {ToolBoxIcon, AIIcon, ToolboxWindow }
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
  li {
    display: flex;
    flex-direction: column;
    align-items: center;
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
      cursor: pointer;
    }
    span {
      margin-top: 5px;
    }
  }
}
</style>
