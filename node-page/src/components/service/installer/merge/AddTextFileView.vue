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
