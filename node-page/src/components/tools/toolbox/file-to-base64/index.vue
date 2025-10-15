<template>
  <div class="file-to-base64">
    <div class="content-wrap">
      <div v-if="error != null" class="error-message">
        {{ error }}
      </div>
      <div class="file-upload-area">
        <el-upload
          drag
          action="none"
          :auto-upload="false"
          :on-change="handleFileChange"
          :show-file-list="false"
        >
          <template v-if="selectedFile == null">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div>
              拖动文件到此或 <em>点击上传</em> ，完成后将自动转为base64展示在底部区域
            </div>
          </template>
          <template v-else>
            <Icon type="ELEMENT_PLUS" value="Document" size="80px"/>
            <p>{{ selectedFile.name }}</p>
          </template>
        </el-upload>
      </div>
      <div class="base64-wrap">
        <p>{{ base64 }}</p>
        <el-button
          v-if="base64 != null"
          class="button-copy"
          type="primary"
          @click="$copyText(base64)"
        >复制</el-button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'FileToBase64',
  data () {
    return {
      developers: ['刘大逵'],
      error: null,
      selectedFile: null,
      base64: null
    }
  },
  methods: {
    // 更换文件
    handleFileChange (file) {
      this.selectedFile = file.raw
      const reader = new FileReader()
      reader.onload = (e) => {
        this.base64 = e.target.result
      }
      reader.onerror = (e) => {
        this.error = `文件读取失败: ${e.message}`
      }
      reader.readAsDataURL(file.raw);
    }
  },
  created () {
    if (!window.FileReader) {
      this.error = '您的浏览器暂不支持此功能'
    }
  },
  mounted () {
    this.$emit('on-rendered')
  }
}
</script>

<style scoped lang="scss">
.file-to-base64 {
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

  // 文件上传
  .file-upload-area {
    flex-shrink: 0;
    height: 150px;
    overflow: hidden;
    & > div {
      height: 100%;
    }
    :deep(.el-upload) {
      height: 100%;
      .el-upload-dragger {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .preview-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      em {
        color: var(--primary-color-match-2);
        font-style: normal;
      }
    }
  }

  // base64内容
  .base64-wrap {
    flex-grow: 1;
    border: 1px dashed var(--el-border-color);
    border-radius: 5px;
    margin-top: 20px;
    position: relative;
    p {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow-y: auto;
      padding: 30px 15px;
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
    .button-copy {
      position: absolute;
      left: 50%;
      bottom: 10px;
      transform: translateX(-50%);
    }
  }

  // 错误消息
  .error-message {
    margin-bottom: 20px;
    min-height: 30px;
    flex-shrink: 0;
    color: #f44336;
    text-align: center;
    font-size: 16px;
  }
}
</style>
