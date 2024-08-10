<template>
  <el-dialog
    :title="title"
    v-model="visible"
    class="markdown-window"
    width="850px"
    append-to-body
  >
    <MarkdownEditor
      :model-value="content"
      :readonly="true"
      :without-padding="true"
    />
  </el-dialog>
</template>

<script>
import MarkdownEditor from "@/components/common/MarkdownEditor.vue";

export default {
  name: 'MarkdownWindow',
  components: {MarkdownEditor},
  data () {
    return {
      visible: false,
      title: '',
      content: ''
    }
  },
  methods: {
    open (title, content) {
      this.visible = true
      this.title = title
      this.content = content
    }
  }
}
</script>

<style scoped lang="scss">

</style>
