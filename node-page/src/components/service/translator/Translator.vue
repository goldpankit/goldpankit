<template>
  <div class="translator">
    <div class="translator-item">
      <h3>文件路径翻译函数</h3>
      <p class="code">
        <em>function</em> translate&nbsp;<em>(</em>filepath<span>: 文件路径</span>, filename<span>: 文件名</span>, suffix<span>: 文件后缀</span><em>)</em> <em>{</em>
        <el-button
          type="primary"
          @click="filepathCodeEditor.fullscreen = !filepathCodeEditor.fullscreen"
        >全屏</el-button>
      </p>
      <div class="editor filepath-code-editor" :class="{ fullscreen: filepathCodeEditor.fullscreen }"></div>
      <p>}</p>
    </div>
    <div class="translator-item">
      <h3>文件内容翻译函数</h3>
      <p class="code">
        <em>function</em> translate&nbsp;<em>(</em>filepath<span>: 文件路径</span>, filename<span>: 文件名</span>, suffix<span>: 文件后缀</span>, setting<span>: 文件设置</span>,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;content<span>: 文件内容</span><em>)</em> <em>{</em>
        <el-button
          type="primary"
          @click="contentCodeEditor.fullscreen = !contentCodeEditor.fullscreen"
        >全屏</el-button>
      </p>
      <div class="editor content-code-editor" :class="{ fullscreen: contentCodeEditor.fullscreen }"></div>
      <p>}</p>
    </div>
    <div class="toolbar" v-show="filepathCodeEditor.fullscreen || contentCodeEditor.fullscreen">
      <h3>{{ filepathCodeEditor.fullscreen ? '文件路径编译函数' : '文件内容编译函数' }}</h3>
      <img src="/images/common/exit-fullscreen.svg" @click="exitFullScreen">
    </div>
  </div>
</template>

<script>
import * as monaco from "monaco-editor";

/**
 * 解决
 * Error: Unexpected usage
 *     at _EditorSimpleWorker.loadForeignModule (editorSimpleWorker.js:504:31)
 *     at webWorker.js:38:30
 *     at async tsMode.js:88:16
 *     at errors.js:15:27
 */
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
self.MonacoEnvironment={
  getWorker(_, label){
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  }
}

export default {
  name: 'Translator',
  props: {
    // 翻译器配置信息
    data: {
      required: true
    }
  },
  data () {
    return {
      saveTimeout: null,
      filepathCodeEditor: {
        fullscreen: false
      },
      contentCodeEditor: {
        fullscreen: false
      },
    }
  },
  methods: {
    // 处理输入
    handleSave () {
      if (this.saveTimeout != null) {
        clearTimeout(this.saveTimeout)
      }
      this.saveTimeout = setTimeout(() => {
        this.$emit('save')
      }, 300)
    },
    // 退出全屏
    exitFullScreen () {
      this.filepathCodeEditor.fullscreen = false
      this.contentCodeEditor.fullscreen = false
    },
    // 初始化编辑器
    __initEditor (selector, valueKey) {
      // 初始化高亮编辑器
      const editor = monaco.editor.create(
        document.querySelector(selector),
        {
          value: this.data[valueKey],
          language: 'javascript',
          readOnly: false,
          automaticLayout: true,
          fontSize: 15,
          minimap: {
            enabled: true
          }
        }
      )
      // - 内容变更后触发v-model修改
      editor.onDidChangeModelContent(e => {
        this.data[valueKey] = editor.getValue()
        this.handleSave()
      })
    }
  },
  mounted () {
    this.__initEditor('.translator .filepath-code-editor', 'filepath')
    this.__initEditor('.translator .content-code-editor', 'content')
    // 绑定esc 退出全屏
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this.exitFullScreen()
      }
    })
  }
}
</script>

<style scoped lang="scss">
.translator {
  width: 100%;
  .translator-item {
    h3 {
      font-weight: normal;
      font-size: 13px;
    }
    .code {
      font-size: 15px;
      position: relative;
      padding: 20px 80px 20px 0;
      line-height: 25px;
      word-break: break-all;
      // 关键字
      em {
        color: #0000ff;
        font-style: normal;
      }
      // 注释
      span {
        color: #999;
      }
      & > .el-button {
        position: absolute;
        top: 10px;
        right: 0;
      }
    }
    // 编辑器
    .editor {
      height: 150px;
      &.fullscreen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 99;
        padding: 60px 20px;
        background-color: #fff;
      }
    }
  }
  // 工具栏
  .toolbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    z-index: 100;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    background-color: var(--background-color);
    img {
      width: 20px;
      cursor: pointer;
    }
  }
}
</style>
