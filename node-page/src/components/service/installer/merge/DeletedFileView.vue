<template>
  <div class="deleted-file-view">
    <div class="deleted-file-view__wrap">
      <div class="tip">
        <p>{{$t('service.deleteFileTip')}}</p>
      </div>
      <div class="container">
        <img v-if="isImage" :src="'data:image/png;base64,' + file.localContent" alt="">
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
  name: "DeletedImageView",
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
  },
  methods: {
  },
  mounted () {
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
    transition: all ease .15s;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      height: 60%;
      object-fit: contain;
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
