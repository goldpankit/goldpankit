<template>
  <el-dialog
    v-if="currentBuild != null"
    custom-class="script-preview-dialog"
    v-model="visible"
    destroy-on-close
    :title="'构建脚本/' + currentBuild.name"
    append-to-body
  >
    <!-- 脚本输入框 -->
    <div class="script-input-container"></div>
    <!-- 添加判断，防止脚本执行完成后依然显示操作 -->
    <div v-if="!currentBuild.__executing && builds.findIndex(b => b === currentBuild) !== -1" class="opera">
      <el-button :disabled="currentBuild.__executing" @click="visible = false">关闭</el-button>
      <el-button type="primary" @click="copy(currentBuild)">复制</el-button>
      <el-button :disabled="currentBuild.__executing" type="primary" @click="$emit('ignore', currentBuild)">忽略此项构建</el-button>
      <el-button :disabled="currentBuild.__executing" type="important2" @click="execute">执行该脚本</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import * as monaco from "monaco-editor";

export default {
  name: 'ScriptPreviewDialog',
  computed: {
    ...mapState(['installData']),
    // 构建列表
    builds () {
      if (this.installData == null) {
        return []
      }
      return this.installData.build.builds
    }
  },
  data () {
    return {
      visible: false,
      currentBuild: null
    }
  },
  methods: {
    // 打开窗口
    open (build) {
      this.currentBuild = build
      this.visible = true
      this.$nextTick(() => {
        // 初始化高亮编辑器
        const editor = monaco.editor.create(
            document.querySelector('.script-preview-dialog .script-input-container'),
            {
              value: build.content,
              language: 'sql',
              // theme: 'vs-dark',
              readOnly: false,
              automaticLayout: true,
              minimap: {
                enabled: false
              }
            }
        )
        // - 内容变更后触发v-model修改
        editor.onDidChangeModelContent(e => {
          build.content = editor.getValue()
        })
      })
    },
    // 复制
    copy (build) {
      navigator.clipboard.writeText(build.content)
      this.$tip.apiSuccess('复制成功')
    },
    // 执行脚本
    execute () {
      // 关闭窗口
      this.visible = false
      // 触发执行事件
      this.$emit('execute', this.currentBuild)
    }
  }
}
</script>

<style scoped lang="scss">
.script-preview-dialog {
  .el-dialog__body {
    padding-top: 10px;
  }
  .data-source-select {
    margin-bottom: 10px;
  }
  // 脚本输入框
  .script-input-container {
    height: 800px;
  }
  .opera {
    padding: 20px 0 0 0;
    display: flex;
    justify-content: center;
  }
}
</style>