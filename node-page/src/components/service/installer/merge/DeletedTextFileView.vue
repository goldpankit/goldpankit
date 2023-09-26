<template>
  <div class="deleted-file-view" :class="{loading}">
    <div class="deleted-file-view__wrap">
      <div class="tip">
        <p>{{$t('service.deleteFileTip')}}</p>
      </div>
      <div class="container"></div>
    </div>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor'
let diffEditor
export default {
  name: "DeletedFileView",
  props: {
    // 原始内容（要删除的本地文件内容）
    originalText: {
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
        if (diffEditor != null) {
          diffEditor.setValue(this.originalText)
        }
        this.__loadSuccess()
      })
    },
    // 初始化
    init () {
      diffEditor = monaco.editor.create(
        this.$el.querySelector(".container"),
        {
          value: this.originalText,
          language: 'text/plain',
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
.deleted-file-view {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  &.loading {
    .container {
      opacity: 0;
    }
  }
  .deleted-file-view__wrap {
    height: 100%;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
  }
  .tip {
    flex-shrink: 0;
    padding: 10px 20px;
    color: var(--color-danger);
    font-weight: bold;
  }
  .container {
    flex-grow: 1;
    opacity: 1;
    transition: all ease .15s
  }
}
</style>
