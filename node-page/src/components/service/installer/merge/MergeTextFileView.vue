<template>
  <div class="merge-file-view" :class="{loading}">
    <div class="toolbar">
      <p>{{$t('service.mergeTip')}}</p>
      <div class="merge-file-view__opera">
        <el-button @click="prev" icon="Top">Prev</el-button>
        <el-button @click="next" icon="Bottom">Next</el-button>
      </div>
    </div>
    <div class="container"></div>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor'
let diffEditor,diffNavi,originalModel,modifiedModel
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
      loading: true
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
        if (originalModel != null) {
          originalModel.setValue(this.originalText || '')
        }
        if (modifiedModel != null) {
          modifiedModel.setValue(this.newText || '')
        }
        this.__loadSuccess()
      })
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
          // 不忽略空格
          ignoreTrimWhitespace: false
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
      // 差异导航对象
      diffNavi = monaco.editor.createDiffNavigator(diffEditor, {
        followsCaret: true, // resets the navigator state when the user selects something in the editor
        ignoreCharChanges: true, // jump from line to line
      });
      this.__loadSuccess()
    },
    next () {
      diffNavi.next()
    },
    prev () {
      diffNavi.previous()
    },
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
    .merge-file-view__opera {
      flex-shrink: 0;
      width: 200px;
      margin-left: 30px;
      display: flex;
      justify-content: flex-end;
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
