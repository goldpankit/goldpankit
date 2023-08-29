<template>
  <ul class="kit-toolbar">
    <li>
      <div class="icon-wrap" @click="$refs.aiWindow.open()">
        <AIIcon/>
      </div>
      <span>{{$t('tool.ai.name')}}</span>
    </li>
  </ul>
  <AIWindow ref="aiWindow"/>
</template>

<script>
import AIIcon from "./ai/AIIcon.vue";
import AIWindow from "./ai/AIWindow.vue";

export default {
  name: "Toolbar",
  components: {AIWindow, AIIcon}
}
</script>

<style scoped lang="scss">
.kit-toolbar {
  position: absolute;
  right: 50px;
  bottom: 50px;
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
