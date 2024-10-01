<template>
  <el-dialog
    class="tool-window"
    :class="{fullscreen}"
    draggable
    :fullscreen="true"
    :show-close="false"
    :append-to-body="true"
  >
    <template #header>
      <header class="tool-window__header">
        <h2>{{title}}</h2>
        <div class="window-opera">
          <span class="icon" @click="fullscreen = !fullscreen">
            <el-icon v-if="!fullscreen"><FullScreen /></el-icon>
            <img v-else src="/images/common/exit-fullscreen.svg">
          </span>
        </div>
      </header>
    </template>
    <slot></slot>
  </el-dialog>
</template>

<script>

export default {
  name: "ToolWindow",
  props: {
    title: {
      required: true
    }
  },
  data () {
    return {
      fullscreen: false
    }
  }
}
</script>

<style lang="scss">
.tool-window {
  border-radius: 10px !important;
  overflow: hidden !important;
  width: 1000px !important;
  height: 90% !important;
  top: 5%;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all ease .15s;
  &.fullscreen {
    width: 98% !important;
    height: 95% !important;
    top: 2.5%;
  }
  .el-dialog__header {
    flex-shrink: 0;
    padding: 0 !important;
    margin: 0;
    .tool-window__header {
      background: #eee;
      height: 30px;
      line-height: 30px;
      display: flex;
      justify-content: center;
      position: relative;
      h2 {
        font-size: var(--font-size);
        font-weight: normal;
      }
      .window-opera {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        padding-right: 10px;
        display: flex;
        align-items: center;
        .icon {
          height: 26px;
          padding: 5px;
          box-sizing: border-box;
          line-height: initial;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 5px;
          transition: all ease .15s;
          &:hover {
            background: #e0e0e0;
          }
          .el-icon {
            font-size: 14px;
          }
          img {
            width: 14px;
          }
        }
      }
    }
  }
  .el-dialog__body {
    padding: 0 !important;
    margin: 0;
    flex-grow: 1;
    overflow: hidden;
  }
}
</style>
