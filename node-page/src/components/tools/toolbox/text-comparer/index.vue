<template>
  <div class="text-comparer">
    <div class="nav-buttons">
      <div class="diff-count">
        共存在 <em>{{ diffCount }}</em> 处差异
      </div>
      <div class="nav-controls">
        <el-button size="default" type="primary" @click="goToPrevDiff">
          <el-icon><Top/></el-icon>
        </el-button>
        <el-button size="default" type="primary" @click="goToNextDiff">
          <el-icon><Bottom/></el-icon>
        </el-button>
        <el-button size="default" type="danger" @click="goToNextDiff">
          清空
        </el-button>
      </div>
    </div>
    <div class="container">
      <div class="editor-container" ref="diffEditorContainer"></div>
    </div>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor'

// 将编辑器相关实例声明在组件外部
let diffEditor = null
let diffNavi = null
let originalModel = null
let modifiedModel = null

export default {
  name: 'TextComparer',
  data() {
    return {
      developers: ['刘大逵'],
      hasDiffComputed: false,
      diffCount: 0
    }
  },
  methods: {
    initDiffEditor() {
      // 创建两个模型用于对比
      originalModel = monaco.editor.createModel('', 'text')
      modifiedModel = monaco.editor.createModel('', 'text')

      // 创建差异编辑器
      diffEditor = monaco.editor.createDiffEditor(this.$refs.diffEditorContainer, {
        automaticLayout: true,
        readOnly: false,
        renderSideBySide: true,
        originalEditable: true
      })

      // 设置编辑器的模型
      diffEditor.setModel({
        original: originalModel,
        modified: modifiedModel
      })

      // 监听两个编辑器的内容变化
      originalModel.onDidChangeContent(() => {
        this.updateDiffCount();
      });

      modifiedModel.onDidChangeContent(() => {
        this.updateDiffCount();
      });

      // 监听差异计算完成事件
      diffEditor.onDidUpdateDiff(() => {
        this.updateDiffCount();
      });
    },

    // 新增更新差异数量的方法
    updateDiffCount() {
      const lineChanges = diffEditor.getLineChanges() || [];
      this.diffCount = lineChanges.length;

      // 差异计算完成后再创建导航器
      if (!diffNavi) {
        diffNavi = monaco.editor.createDiffNavigator(diffEditor, {
          followsCaret: true,
          ignoreCharChanges: true,
        });
      }
      this.hasDiffComputed = true;
    },

    updateContent(originalText, modifiedText) {
      if (!originalModel || !modifiedModel) {
        this.initDiffEditor();
      }
      originalModel.setValue(originalText || '')
      modifiedModel.setValue(modifiedText || '')

      // 重置状态
      this.hasDiffComputed = false;
      this.diffCount = 0;
      if (diffNavi) {
        diffNavi.dispose();
        diffNavi = null;
      }
    },

    goToPrevDiff() {
      if (diffNavi && this.hasDiffComputed) {
        diffNavi.previous();
      }
    },

    goToNextDiff() {
      if (diffNavi && this.hasDiffComputed) {
        diffNavi.next();
      }
    }
  },
  mounted() {
    this.initDiffEditor()
    this.$emit('on-rendered')
  },
  beforeDestroy() {
    if (diffEditor) {
      diffEditor.dispose()
      diffEditor = null
    }
    if (originalModel) {
      originalModel.dispose()
      originalModel = null
    }
    if (modifiedModel) {
      modifiedModel.dispose()
      modifiedModel = null
    }
    if (diffNavi) {
      diffNavi.dispose()
      diffNavi = null
    }
  }
}
</script>

<style scoped lang="scss">
.text-comparer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .nav-buttons {
    flex-shrink: 0;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--tool-toolbar-background-color);
    border-bottom: 1px solid var(--tool-toolbar-border-color);

    .diff-count {
      font-size: 14px;
      color: #606266;
      em {
        color: var(--primary-color-match-2);
        font-weight: bold;
        font-style: normal;
      }
    }

    .nav-controls {
      display: flex;
      .el-icon {
        font-size: 16px;
      }
    }
  }

  .container {
    flex: 1;
    .editor-container {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
