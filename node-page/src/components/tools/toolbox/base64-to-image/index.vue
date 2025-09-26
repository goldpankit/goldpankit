<template>
  <div class="base64-to-image">
    <div class="content-wrap">
      <div class="base64-wrap">
        <el-input v-model="base64" type="textarea"/>
      </div>
      <div class="preview-image-wrap">
        <img v-if="base64 != null" class="preview-image" :src="base64" alt="预览"/>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Base64ToImage',
  data () {
    return {
      developers: ['刘大逵'],
      base64: null
    }
  },
  mounted () {
    this.$emit('on-rendered')
  }
}
</script>

<style scoped lang="scss">
.base64-to-image {
  height: 100%;
  overflow-y: auto;
  padding: 30px;
  .content-wrap {
    height: 100%;
    min-height: 500px;
    margin: 0 auto;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: #fff;
    padding: 30px;
    border: 1px solid #eee;
    & > * {
      width: 100%;
    }
  }

  // 图片预览
  .preview-image-wrap {
    flex-grow: 1;
    overflow: hidden;
    border: 1px dashed var(--el-border-color);
    border-radius: 5px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    &::before {
      content: '预览';
      position: absolute;
      top: 0;
      left: 0;
      color: #999;
      z-index: 9;
      padding: 8px 10px;
    }
    & > div {
      height: 100%;
    }
    .preview-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  // base64内容
  .base64-wrap {
    flex-shrink: 0;
    height: 300px;
    border: 1px dashed var(--el-border-color);
    border-radius: 5px;
    margin-bottom: 20px;
    position: relative;
    box-sizing: border-box;
    padding-bottom: 10px;
    .el-textarea {
      position: absolute;
      top: 30px;
      bottom: 10px;
      left: 0;
      width: 100%;
      overflow-y: auto;
      :deep(.el-textarea__inner) {
        height: 100%;
        border: 0;
        box-shadow: none !important;
        resize: none;
        padding: 0 10px;
        box-sizing: border-box;
      }
    }
    &::before {
      content: 'Base64';
      position: absolute;
      width: 100%;
      background-color: rgba(255, 255, 255, .85);
      top: 0;
      left: 0;
      color: #999;
      z-index: 9;
      padding: 8px 10px;
    }
  }
}
</style>
