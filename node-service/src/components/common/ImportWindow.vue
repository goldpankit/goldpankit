<template>
  <el-dialog
    width="500px"
    :title="title"
    :visible.sync="visible"
    append-to-body
    custom-class="eva-dialog import-window"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <el-upload
      drag
      :show-file-list="false"
      action="none"
      accept=".xlsx"
      :before-upload="handleBeforeUpload"
    >
      <template v-if="form.file == null">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </template>
      <template v-else>
        <i class="el-icon-files"></i>
        <div class="el-upload__text">{{form.file.name}}<em></em></div>
      </template>
    </el-upload>
    <div slot="footer" class="import-window__footer">
      <div class="sync-exists">
        <el-checkbox v-model="form.sync"/><span>同步已存在的数据</span>
      </div>
      <div class="opera">
        <el-button type="text" icon="el-icon-download" @click="downloadTemplate">下载模版</el-button>
        <el-button @click="cancel">{{cancelText}}</el-button>
        <el-button type="primary" @click="confirm" :loading="isWorking">{{confirmText}}</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import request from '@/utils/request'
import { downloadLocalFile } from '@/api/system/common'
export default {
  name: 'ImportWindow',
  props: {
    // 导入接口地址
    action: {
      required: true
    },
    // 确认按钮文案
    confirmText: {
      type: String,
      default: '导入'
    },
    // 取消按钮文案
    cancelText: {
      type: String,
      default: '取消'
    },
    // 模版地址
    templatePath: {
      required: true
    },
    // 下载后的模版文件名称
    templateName: {
      required: true
    }
  },
  data () {
    return {
      visible: false,
      isWorking: false,
      title: '导入数据',
      form: {
        sync: false,
        file: false
      }
    }
  },
  methods: {
    /**
     * 打开窗口
     *
     * @param title 窗口标题
     */
    open (title) {
      this.visible = true
      this.title = title
      this.form.sync = false
      this.form.file = null
    },
    /**
     * 确定导入
     */
    confirm () {
      if (this.form.file == null) {
        this.$tip.warning('请选择文件')
        return
      }
      this.isWorking = true
      const param = new FormData()
      param.set('file', this.form.file)
      param.set('sync', this.form.sync)
      request.post(this.action, param, {
        headers: {
          'Content-Type': 'multipart/form-data;charset=UTF-8'
        }
      })
        .then(data => {
          this.$tip.success('导入成功，共导入' + data + '条记录')
          this.visible = false
          this.$emit('success')
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
        .finally(() => {
          this.isWorking = false
        })
    },
    /**
     * 取消
     */
    cancel () {
      this.visible = false
    },
    /**
     * 下载模版
     */
    downloadTemplate () {
      downloadLocalFile({
        path: this.templatePath,
        name: this.templateName
      })
        .then(data => {
          this.download(data)
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    /**
     * 文件上传前存储上传的文件
     *
     * @param file 需导入的文件
     */
    handleBeforeUpload (file) {
      this.form.file = file
      return false
    }
  }
}
</script>

<style lang="scss">
@import "../../assets/style/variables";
.import-window {
  .el-upload {
    width: 100%;
    .el-upload-dragger {
      width: 100%;
      .el-icon-upload, .el-icon-files {
        font-size: 67px;
        color: #C0C4CC;
        margin: 40px 0 16px;
        line-height: 50px;
      }
    }
  }
  .import-window__footer {
    display: flex;
    .sync-exists {
      width: 200px;
      flex-shrink: 0;
      text-align: left;
      font-size: 13px;
      display: flex;
      align-items: center;
      .el-checkbox {
        margin-right: 10px;
      }
      & > * {
        vertical-align: middle;
      }
    }
    .opera {
      flex-grow: 1;
      a {
        font-size: 12px;
        margin-right: 10px;
        text-decoration: none;
        .el-icon-download {
          font-size: 15px;
          position: relative;
          top: 2px;
        }
      }
    }
  }
}
</style>
