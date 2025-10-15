<template>
  <div class="merge-file-view" :class="{loading}">
    <div class="toolbar">
      <p>
        <template v-if="renderSideBySide">提示：左侧为本地文件内容，右侧为即将写入文件的内容</template>
      </p>
      <div class="merge-file-view__opera">
        <el-checkbox v-model="renderSideBySide" label="开启分屏对比" @change="handleSideBySideChange"/>
        <el-button size="small" type="primary" @click="prev" icon="Top">上一处</el-button>
        <el-button size="small" type="primary" @click="next" icon="Bottom">下一处</el-button>
      </div>
    </div>
    <div class="container"></div>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor'
let diffEditor,originalModel,modifiedModel
export default {
  name: "MergeTextFileView",
  props: {
    // 文件路径
    filepath: {
      type: String,
      required: true
    },
    // 因子，因子发生变化后，将重新渲染文本对比
    factor: {
      required: true
    },
    // 原始内容
    originalText: {
      type: String,
      required: true
    },
    // 新内容
    newText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      loading: true,
      // 是否分屏
      renderSideBySide: true
    }
  },
  watch: {
    factor () {
      if (diffEditor == null) {
        return
      }
      this.refreshContent()
    }
  },
  methods: {
    // 刷新内容
    refreshContent () {
      this.loading = true
      this.$nextTick(() => {
        const language = this.__getLanguage(this.filepath)
        if (originalModel != null) {
          originalModel.setValue(this.originalText || '')
          originalModel.setLanguage(language)
        }
        if (modifiedModel != null) {
          modifiedModel.setValue(this.newText || '')
          modifiedModel.setLanguage(language)
        }
        this.__loadSuccess()
      })
    },
    // 调整尺寸（在合并窗口分割线拖拽时会触发）
    resize () {
      if (diffEditor != null) {
        diffEditor.layout()
      }
    },
    // 初始化
    init () {
      const language = this.__getLanguage(this.filepath)
      diffEditor = monaco.editor.createDiffEditor(
        this.$el.querySelector(".container"),
        {
          // 允许拖动左右窗口
          enableSplitViewResizing: true,
          // 禁用菜单
          contextmenu: false,
          // 是否分屏
          renderSideBySide: this.renderSideBySide,
          // 不忽略空格
          ignoreTrimWhitespace: false,
          // 是否渲染左侧或中间工具条菜单（为false时，存在向右合并的箭头偶发不出现的情况）
          renderGutterMenu: true
        }
      )
      // 左侧本地内容
      originalModel = monaco.editor.createModel(
        this.originalText,
        language,
      )
      // 右侧覆盖内容
      modifiedModel = monaco.editor.createModel(
        this.newText,
        language
      )
      // - 内容变更后触发v-model修改
      modifiedModel.onDidChangeContent((e) => {
        this.$emit('update:new-text', modifiedModel.getValue())
      })
      // 设置左右侧内容到编辑器中
      diffEditor.setModel({
        original: originalModel,
        modified: modifiedModel,
      })
      this.__loadSuccess()
    },
    // 上一处差异
    next () {
      diffEditor.goToDiff('next')
    },
    // 下一处差异
    prev () {
      diffEditor.goToDiff('previous')
    },
    // 切换分屏
    handleSideBySideChange (checked) {
      diffEditor.updateOptions({
        renderSideBySide: checked
      })
    },
    // 加载完成
    __loadSuccess () {
      setTimeout(() => {
        this.loading = false
      }, 300)
    },
    // 根据文件名称获取语言
    __getLanguage (filepath) {
      if (filepath == null || filepath === '') {
        return 'text/plain'
      }
      // 获取后缀
      let pointIndex = filepath.indexOf('.')
      if (pointIndex === -1) {
        return 'text/plain'
      }
      const suffix = filepath.substring(filepath.lastIndexOf('.'))
      // 从monaco中获取所有语言
      const languages = monaco.languages.getLanguages()
      const targetLang = languages.find(lang => {
        return lang.extensions != null && lang.extensions.find(ext => ext === suffix) != null
      })
      if (targetLang != null) {
        return targetLang.id
      }
      return 'text/plain'
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.init()
    })
  }
}
</script>

<style scoped lang="scss">
.merge-file-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  &.loading {
    .container {
      opacity: 0;
    }
  }
  .toolbar {
    flex-shrink: 0;
    padding: 5px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    & > p {
      word-break: break-all;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .merge-file-view__opera {
      flex-shrink: 0;
      width: 200px;
      margin-left: 30px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
      .el-button {
        margin: 0;
      }
    }
  }
  .container {
    flex-grow: 1;
    width: 100%;
    height: 100%;
    opacity: 1;
    transition: all ease .15s
  }
}
</style>
