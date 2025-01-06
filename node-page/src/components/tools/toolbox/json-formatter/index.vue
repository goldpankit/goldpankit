<template>
  <div class="page">
    <!-- 操作/设置 -->
    <div class="opera-wrap">
      <ul class="setting-wrap">
        <li>
          <label>开启代码缩略</label>
          <span>
            <el-switch size="default" v-model="settings.minimap" @change="switchMinimap"/>
          </span>
        </li>
        <li>
          <label>开启自动修复</label>
          <span>
            <el-switch size="default" v-model="settings.sanitized" @change="switchSanitize"/>
          </span>
        </li>
        <li class="setting-mini-input">
          <label>缩进</label>
          <span>
            <el-input-number
              size="default"
              :controls="false"
              v-model="settings.indent"
              :min="0"
              :step="2"
              :max="10"
              @change="initEditor(),format()"
            />个空格
          </span>
        </li>
        <li class="setting-mini-input">
          <label>字体</label>
          <span>
            <el-input-number
              size="default"
              :controls="false"
              v-model="settings.fontSize"
              :min="12"
              :step="1"
              :max="30"
              @change="initEditor"
            />px
          </span>
        </li>
      </ul>
      <div class="opera-buttons">
        <el-button type="primary" size="default" @click="format">格式化</el-button>
        <el-button type="primary" size="default" @click="copy">复制</el-button>
        <el-button type="danger" size="default" @click="clear">清空</el-button>
      </div>
    </div>
    <!-- 错误消息 -->
    <div v-if="errorMessage != null && errorMessage !== ''" class="error-message">{{ errorMessage }}</div>
    <!-- 代码编辑器 -->
    <div v-if="loading" class="input-editor"></div>
    <!-- 开启自动修复提示 -->
    <el-dialog
      class="json-formatter-sanitize-dialog"
      v-model="sanitizeDialog.visible"
      title="确认开启自动修复"
      width="500"
    >
      <div>
        <p>开启自动修复功能后，将会根据以下规则进行内容替换，可能会影响JSON本身的内容，确认开启吗？</p>
        <ul>
          <li><em>'</em><span>=></span><em>"</em></li>
          <li><em>‘</em><span>=></span><em>"</em></li>
          <li><em>’</em><span>=></span><em>"</em></li>
          <li><em>“</em><span>=></span><em>"</em></li>
          <li><em>”</em><span>=></span><em>"</em></li>
          <li><em>：</em><span>=></span><em>:</em></li>
          <li><em>True</em><span>=></span><em>true</em></li>
          <li><em>False</em><span>=></span><em>false</em></li>
        </ul>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="default" @click="cancelEnableSanitize">取消</el-button>
          <el-button size="default" type="primary" @click="confirmEnableSanitize">确认开启</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor'
import JsonFormatter from './json.formatter'
let jsonFormatterEditor
export default {
  data () {
    return {
      developers: ['刘大逵', '天析'],
      data: '',
      errorMessage: null,
      settings: {
        indent: 4,
        fontSize: 13,
        minimap: true,
        sanitized: false
      },
      loading: false,
      sanitizeDialog: {
        visible: false
      }
    }
  },
  methods: {
    // 初始化编辑器
    initEditor () {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
        this.$nextTick(() => {
          jsonFormatterEditor = monaco.editor.create(
            document.querySelector('.page .input-editor'),
            {
              value: this.data,
              language: 'json',
              readOnly: false,
              automaticLayout: true,
              tabSize: this.settings.indent,
              fontSize: this.settings.fontSize,
              minimap: {
                enabled: this.settings.minimap
              }
            }
          )
          // 内容变更后触发value修改
          jsonFormatterEditor.onDidChangeModelContent(e => {
            this.data = jsonFormatterEditor.getValue()
          })
        })
      })
    },
    // 切换自动修复
    switchSanitize (value) {
      if (!value) {
        return
      }
      // 提示
      this.sanitizeDialog.visible = true
    },
    // 切换代码缩略图
    switchMinimap (value) {
      this.settings.minimap = value
      this.initEditor()
    },
    // 确认启用自动修复
    confirmEnableSanitize () {
      this.settings.sanitized = true
      this.sanitizeDialog.visible = false
      this.format()
    },
    // 确认取消自动修复
    cancelEnableSanitize () {
      this.settings.sanitized = false
      this.sanitizeDialog.visible = false
    },
    // 格式化
    format () {
      try {
        this.errorMessage = null
        this.data = JsonFormatter.format(this.data, this.settings.indent, this.settings.sanitized)
        jsonFormatterEditor.setValue(this.data)
      } catch (e) {
        this.errorMessage = e.message
      }
    },
    // 复制
    copy () {
      const copied = navigator.clipboard.writeText(this.data)
        .then(() => {
          this.$tip.success('复制成功')
        })
        .catch(() => {
          this.$tip.error('复制失败，暂不支持您的浏览器！')
        })
    },
    // 清空
    clear () {
      this.data = ''
      jsonFormatterEditor.setValue(this.data)
    },
    // 全屏切换，在ToolRouter中调用
    onSwitchFullscreen () {
      this.initEditor()
    }
  },
  mounted () {
    this.initEditor()
    this.$emit('on-rendered')
  }
}
</script>

<style scoped lang="scss">
.page {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .opera-wrap {
    flex-shrink: 0;
    display: flex;
    padding: 10px 20px;
    border-bottom: 1px solid var(--tool-toolbar-border-color);
    background-color: var(--tool-toolbar-background-color);
    ul.setting-wrap {
      flex-grow: 1;
      display: flex;
      align-items: center;
      li {
        display: flex;
        align-items: center;
        margin-left: 20px;
        label {
          margin-right: 10px;
          color: var(--color-gray);
        }
        span {
          display: flex;
          align-items: center;
        }
        &:first-of-type {
          margin-left: 0;
        }
      }
      // 缩进/字体
      .setting-mini-input {
        .el-input-number {
          width: 60px;
          margin-right: 5px;
          :deep(.el-input__inner) {
            text-align: center;
          }
        }
      }
    }
    .opera-buttons {
      flex-shrink: 0;
    }
  }
  .error-message {
    padding: 10px;
    color: var(--color-light);
    flex-shrink: 0;
    background-color: var(--color-danger);;
  }
  .input-editor {
    flex: 1;
  }
}
</style>
<style lang="scss">
.json-formatter-sanitize-dialog {
  .el-dialog__body {
    padding: 0 15px !important;
    p {
      font-size: 15px;
      margin-bottom: 10px;
    }
    ul {
      padding: 10px;
      border: 1px solid #eee;
      li {
        display: flex;
        align-items: center;
        em {
          color: var(--color-danger);
          font-size: 16px;
          font-style: normal;
        }
        span {
          margin: 0 10px;
        }
      }
    }
  }
}
</style>
