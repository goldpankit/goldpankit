<template>
  <div class="import-button">
    <el-button @click="$refs.importWindow.open(text)">{{text}}</el-button>
    <ImportWindow :action="action" :template-path="templatePath" :template-name="templateName" ref="importWindow" @success="handleSuccess"/>
  </div>
</template>

<script>
import ImportWindow from './ImportWindow'
export default {
  name: 'ImportButton',
  components: { ImportWindow },
  props: {
    // 按钮文案
    text: {
      default: '导入'
    },
    // 模版地址
    templatePath: {
      required: true
    },
    // 下载后的模版文件名称
    templateName: {
      required: true
    },
    // 导入接口地址
    action: {
      required: true
    }
  },
  methods: {
    handleSuccess () {
      this.$emit('success')
    }
  }
}
</script>
