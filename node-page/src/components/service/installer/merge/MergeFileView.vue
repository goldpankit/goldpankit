<template>
  <div class="merge-file-view">
    <div class="merge-file-view__wrap">
      <div class="tip">
        <p>{{$t('service.mergeTip')}}</p>
      </div>
      <div class="container">
        <ul v-if="isImage" class="image-compare">
          <li><img :src="'data:image/png;base64,' + file.localContent" alt=""></li>
          <li><img :src="'data:image/png;base64,' + file.content" alt=""></li>
        </ul>
        <div v-else class="file">
          <i class="iconfont icon-wenjian"></i>
          <label>{{file.filepath}}</label>
          <p>{{$t('service.mergeUnPreview')}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const imageSuffixList = ['jpg', 'jpeg', 'png', 'gif', 'bmp']
export default {
  name: "MergeFileView",
  props: {
    // 文件
    file: {
      required: true
    }
  },
  computed: {
    isImage () {
      return imageSuffixList.find(suffix => suffix === this.file.suffix.toLowerCase())
    }
  }
}
</script>

<style scoped lang="scss">
.merge-file-view {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  &.loading {
    .container {
      opacity: 0;
    }
  }
  .merge-file-view__wrap {
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
    transition: all ease .15s;
    display: flex;
    justify-content: center;
    align-items: center;
    // 图片对比
    .image-compare {
      display: flex;
      width: 100%;
      height: 100%;
      padding: 0 20px 20px 20px;
      li {
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--background-color);
        &:first-of-type {
          margin-right: 20px;
        }
      }
      img {
        height: 60%;
        object-fit: contain;
      }
    }
    .file {
      display: flex;
      flex-direction: column;
      align-items: center;
      label {
        font-weight: bold;
        margin-top: 5px;
      }
      p {
        margin-top: 10px;
        color: var(--color-gray);
      }
      i {
        font-size: 50px;
      }
    }
  }
}
</style>
