<template>
  <div class="merge-editor">
    <div class="toolbar">
      <p>{{$t('service.mergeTip')}}</p>
      <div class="opera">
        <el-button @click="prev" icon="Top">Prev</el-button>
        <el-button @click="next" icon="Bottom">Next</el-button>
      </div>
    </div>
    <div class="container"></div>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor'
let diffNavi
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
  data() {
    return {
    };
  },
  methods: {
    next () {
      diffNavi.next()
    },
    prev () {
      diffNavi.previous()
    }
  },
  mounted () {
    this.$nextTick(() => {
      const diffEditor = monaco.editor.createDiffEditor(
        document.querySelector(".container"),
        {
          // 允许拖动左右窗口
          enableSplitViewResizing: true,
          // 禁用菜单
          contextmenu: false
        }
      )
      const modifiedModel = monaco.editor.createModel(
        this.newText,
        "text/plain"
      )
      // 内容变更后触发v-model修改
      modifiedModel.onDidChangeContent((e) => {
        this.$emit('update:new-text', modifiedModel.getValue())
      })
      diffEditor.setModel({
        original: monaco.editor.createModel(
          this.originalText,
          "text/plain"
        ),
        modified: modifiedModel,
      })
      // 差异导航对象
      diffNavi = monaco.editor.createDiffNavigator(diffEditor, {
        followsCaret: true, // resets the navigator state when the user selects something in the editor
        ignoreCharChanges: true, // jump from line to line
      });
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
  .toolbar {
    flex-shrink: 0;
    padding: 5px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .container {
    flex-grow: 1;
    width: 100%;
    height: 100%;
  }
}
</style>
