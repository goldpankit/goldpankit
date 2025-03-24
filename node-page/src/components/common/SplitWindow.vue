<template>
  <SplitWrapper class="split-window" :gutter-size="6">
    <slot></slot>
  </SplitWrapper>
</template>

<script>
import { SplitWrapper } from 'vue3-split'
export default {
  name: 'SplitWindow',
  components: { SplitWrapper }
}
</script>

<style scoped lang="scss">
.split-window {
  width: 100%;
  height: 100%;
  display: flex;
  // 拖拽
  :deep(.gutter) {
    background-color: var(--tool-toolbar-background-color);
    background-repeat: no-repeat;
    background-position: 50%;
    // 水平布局的拖拽图标
    &.gutter-horizontal {
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
      cursor: col-resize;
    }
    // 垂直布局的拖拽图标
    &.gutter-vertical {
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
      cursor: row-resize;
    }
  }
}
</style>
