<template>
  <div class="markdown-editor" :class="{ 'without-padding': withoutPadding }">
    <v-md-editor
      :model-value="modelValue"
      height="100%"
      left-toolbar="h bold italic strikethrough quote | ul ol table hr | link image code | preview toc fullscreen"
      right-toolbar=""
      :disabled-menus="[]"
      :mode="readonly ? 'preview' : 'editable'"
      @upload-image="handleUploadImage"
      @update:modelValue="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script>

import {uploadImage} from "../../api/common";

export default {
  name: "MarkdownEditor",
  props: {
    modelValue: {
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    withoutPadding: {
      default: false
    }
  },
  data () {
    return {
      // toolbar: 'undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code | save | preview toc sync-scroll fullscreen',
    }
  },
  methods: {
    handleUploadImage(event, insertImage, files) {
      for (const file of files) {
        const formData = new FormData()
        formData.set('file', file)
        // uploadImage(formData)
        //   .then(() => {
        //     insertImage({
        //       url:
        //         'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1269952892,3525182336&fm=26&gp=0.jpg',
        //       desc: '七龙珠',
        //       // width: 'auto',
        //       // height: 'auto',
        //     });
        //   })
      }
    },
  },
  created () {
    console.log('modelValue', this.modelValue)
  }
}
</script>

<style scoped lang="scss">
.markdown-editor {
  width: 100%;
  height: 100%;
  overflow: hidden;
  &.without-padding {
    padding: 0;
    .v-md-editor {
      :deep(.vuepress-markdown-body) {
        padding: 0;
      }
    }
  }
  .v-md-editor {
    :deep(.v-md-textarea-editor) {
      textarea {
        padding: 20px 10px;
      }
    }
    :deep(.vuepress-markdown-body) {
      padding: 30px 15px;
    }
  }
}
</style>
