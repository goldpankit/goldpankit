<template>
  <div class="markdown-editor" :class="{ 'without-padding': withoutPadding }">
    <v-md-editor
      :model-value="modelValue"
      height="100%"
      left-toolbar="h bold italic strikethrough quote | ul ol table hr | link image code | preview toc fullscreen"
      right-toolbar=""
      :disabled-menus="[]"
      :mode="readonly ? 'preview' : 'editable'"
      :placeholder="placeholder"
      @upload-image="handleUploadImage"
      @update:modelValue="$emit('update:modelValue', $event)"
      @image-click="previewImages"
    />
    <el-image-viewer
      v-if="imagePreview.visible"
      ref="imageViewer"
      :url-list="imagePreview.images"
      :teleported="true"
      :initial-index="imagePreview.currentIndex"
      @close="imagePreview.visible = false"
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
    },
    placeholder: {
      default: ''
    }
  },
  data () {
    return {
      // toolbar: 'undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code | save | preview toc sync-scroll fullscreen',
      imagePreview: {
        visible: false,
        currentIndex: 0,
        images: [],
      }
    }
  },
  methods: {
    // 图片上传
    handleUploadImage(event, insertImage, files) {
      for (const file of files) {
        const formData = new FormData()
        formData.set('file', file)
        uploadImage(formData)
          .then((data) => {
            insertImage({
              url: this.getAccessUri(data.accessUri),
              desc: file.name,
              width: 'auto',
              height: 'auto',
            });
          })
      }
    },
    // 预览图片
    previewImages (images, currentIndex) {
      // 过滤图片，将超链接中的图片去掉
      const filterImages = []
      for (let i = 0; i < images.length; i++) {
        const domImg = this.$el.querySelector(`img[src='${images[i]}']`)
        if (domImg == null) {
          continue
        }
        if (this.__isLink(domImg)) {
          continue
        }
        filterImages.push(images[i])
      }
      // 获取位置
      const clickedImage = images[currentIndex]
      const finallyCurrentIndex = filterImages.findIndex(img => img === clickedImage)
      if (finallyCurrentIndex === -1) {
        return
      }
      this.imagePreview.images = filterImages
      this.imagePreview.visible = true
      this.imagePreview.currentIndex = finallyCurrentIndex
    },
    // 判断是否为超链接
    __isLink (dom) {
      if (dom == null) {
        return false
      }
      let parent = dom.parentNode
      while (parent != null && parent.tagName != null) {
        if (parent.tagName.toUpperCase() === 'A') {
          return true
        }
        parent = parent.parentNode
      }
      return false
    }
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
      font-size: 15px;
      font-weight: normal;
      h2 {
        font-size: 18px;
        &::before {
          display: inline-block;
          content: '';
          height: 18px;
          box-sizing: border-box;
          border: 9px solid transparent;
          border-left-color: var(--primary-color-match-2);
          border-radius: 50%;
          position: relative;
          top: 2px;
        }
      }
      h3 {
        font-size: 16px;
      }
      h4 {
        font-size: 14px;
      }
      a {
        color: #42b883 !important;
        text-decoration: underline;
      }
      .v-md-mermaid {
        .node {
          rect, circle, ellipse, polygon, path {
            fill: #dbffef !important;
            stroke: #42b883 !important;
          }
        }
      }
    }
  }
}
</style>
