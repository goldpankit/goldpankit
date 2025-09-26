<template>
  <div class="file-securer">
    <div class="content-wrap">
      <el-alert
        description="支持多大文件？答：能加解密多大文件取决于机器性能！"
        type="info"
        show-icon
        :closable="false"
      />
      <el-alert
        description="会不会暴露？答：纯js进行加解密，不会经过网络，妥善保管加解密即可！"
        type="info"
        show-icon
        :closable="false"
      />
      <el-alert
        description="注意：请务必记住您的加密密码，否则将无法正确解密文件！"
        type="warning"
        show-icon
        :closable="false"
      />
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
              拖动文件到此或 <em>点击上传</em>
            </div>
          </template>
          <template v-else>
            <p class="filename">
              {{ selectedFile.name }}
            </p>
          </template>
        </el-upload>
      </div>
      <div class="password-input">
        <el-input
          type="password"
          size="large"
          show-password
          v-model="password"
          placeholder="此处输入密码进行加解密"
          @input="error = ''"
        />
        <el-button
          type="primary"
          @click="generatePassword"
        >生成随机密码</el-button>
      </div>
      <div class="action-buttons">
        <el-button
          class="encrypt-btn"
          size="large"
          icon="Lock"
          type="primary"
          :disabled="!canProcess"
          :loading="isWorking"
          @click="handleEncrypt"
        >加密并下载</el-button>
        <el-button
          class="decrypt-btn"
          size="large"
          icon="Unlock"
          type="primary"
          :disabled="!canProcess"
          :loading="isWorking"
          @click="handleDecrypt"
        >解密并下载</el-button>
      </div>
      <div class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import { encryptFile, decryptFile, downloadFile } from './file-securer'
import PasswordGenerator from '../password-generator/password.generator'

export default {
  name: 'FileSecurer',
  data() {
    return {
      developers: ['刘大逵'],
      isWorking: false,
      selectedFile: null,
      password: '',
      error: ''
    }
  },
  computed: {
    // 判断是否可以进行处理
    canProcess() {
      return this.selectedFile && this.password.length > 0
    }
  },
  methods: {
    // 更换文件
    handleFileChange (file) {
      this.selectedFile = file.raw
      this.error = ''
    },
    // 生成随机密码
    generatePassword () {
      this.password = PasswordGenerator.generatePassword(12,
        ['lowercase', 'uppercase', 'numbers', 'special'])
    },
    // 加密文件
    handleEncrypt() {
      if (!this.canProcess || this.isWorking) {
        return
      }
      this.isWorking = true
      encryptFile(this.selectedFile, this.password)
        .then(result => {
          downloadFile(result.encryptedData, result.fileName)
          this.error = ''
        })
        .catch(e => {
          this.error = `加密失败，错误信息：${e.message}`
        })
        .finally(() => {
          this.isWorking = false
        })
    },
    // 解密文件
    handleDecrypt() {
      if (!this.canProcess || this.isWorking) {
        return
      }
      this.isWorking = true
      decryptFile(this.selectedFile, this.password)
        .then(result => {
          downloadFile(result.decryptedData, result.fileName)
          this.error = ''
        })
        .catch(e => {
          this.error = `解密失败，文件错误或密码错误`
        })
        .finally(() => {
          this.isWorking = false
        })
    }
  },
  mounted () {
    this.$emit('on-rendered')
  }
}
</script>

<style scoped lang="scss">
.file-securer {
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
}
// 提示
:deep(.el-alert) {
  flex-shrink: 0;
  margin-bottom: 5px;
  .el-alert__icon {
    font-size: 16px !important;
    margin-right: 0 !important;
  }
  &:last-of-type {
    margin-bottom: 0;
  }
}
// 文件上传
.file-upload-area {
  margin-top: 20px;
  flex-grow: 1;
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
    .filename {
      padding: 0 30px;
      word-break: break-all;
    }
    em {
      color: var(--primary-color-match-2);
      font-style: normal;
    }
  }
}

// 密码
.password-input {
  margin-top: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  .el-button {
    margin-left: 10px;
  }
}

// 操作按钮
.action-buttons {
  margin-top: 20px;
  flex-shrink: 0;
  display: flex;
  gap: 20px;
  justify-content: center;
}

// 错误消息
.error-message {
  margin-top: 20px;
  min-height: 30px;
  flex-shrink: 0;
  color: #f44336;
  text-align: center;
  font-size: 14px;
}
</style>
