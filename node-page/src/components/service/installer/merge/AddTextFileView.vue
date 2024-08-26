<template>
  <div class="add-file-view" :class="{loading}">
    <div class="add-file-view__wrap">
      <div class="tip">
        <p>{{$t('service.addFileTip')}}</p>
      </div>
      <div class="container"></div>
    </div>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor'
let diffEditor
export default {
  name: "AddTextFileView",
  props: {
    // 文件路径
    filepath: {
      required: true
    },
    // 内容
    text: {
      required: true
    }
  },
  data () {
    return {
      loading: true
    }
  },
  watch: {
    text () {
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
        if (diffEditor != null) {
          diffEditor.setValue(this.text)
          diffEditor.getModel().setLanguage(this.__getLanguage(this.filepath))
        }
        this.__loadSuccess()
      })
    },
    // 初始化
    init () {
      diffEditor = monaco.editor.create(
        this.$el.querySelector(".container"),
        {
          value: this.text,
          language: this.__getLanguage(this.filepath),
          automaticLayout: true,
          readOnly: true
        }
      )
      this.__loadSuccess()
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
.add-file-view {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  &.loading {
    .container {
      opacity: 0;
    }
  }
  .add-file-view__wrap {
    height: 100%;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
  }
  .tip {
    flex-shrink: 0;
    padding: 10px 20px;
  }
  .container {
    flex-grow: 1;
    opacity: 1;
    transition: all ease .15s
  }
}
</style>
