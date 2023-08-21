<template>
  <div class="merge-editor" :class="{loading}">
    <div class="toolbar">
      <p>{{$t('service.mergeTip')}}</p>
      <div class="merge-editor__opera">
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
  name: "MergeText",
  props: {
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
    originalText () {
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
          originalModel.setValue(this.originalText)
        }
        if (modifiedModel != null) {
          modifiedModel.setValue(this.newText)
        }
        this.__loadSuccess()
      })
    },
    // 初始化
    init () {
      diffEditor = monaco.editor.createDiffEditor(
        document.querySelector(".container"),
        {
          // 允许拖动左右窗口
          enableSplitViewResizing: true,
          // 禁用菜单
          contextmenu: false
        }
      )
      // 左侧本地内容
      originalModel = monaco.editor.createModel(
        this.originalText,
        "text/plain"
      )
      // 右侧覆盖内容
      modifiedModel = monaco.editor.createModel(
        this.newText,
        "text/plain"
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
.merge-editor {
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
    .merge-editor__opera {
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
