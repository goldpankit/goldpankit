<template>
  <div class="translator">
    <div class="translator-item">
      <h3>文件路径翻译函数</h3>
      <p class="code"><em class="keyword">function</em> <em>translate</em>&nbsp;(<em>filepath</em>, <em>filename</em>, <em>suffix</em>) {</p>
      <el-input
        v-model="data.filepath"
        type="textarea"
        :rows="5"
        @input="handleSave"
      />
      <p>}</p>
    </div>
    <div class="translator-item">
      <h3>文件内容翻译函数</h3>
      <p class="code"><em class="keyword">function</em> <em>translate</em>&nbsp;(<em>filepath</em>, <em>filename</em>, <em>suffix</em>, <em>content</em>) {</p>
      <el-input
        v-model="data.content"
        type="textarea"
        :rows="5"
        @input="handleSave"
      />
      <p>}</p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Translator',
  props: {
    // 翻译器配置信息
    data: {
      required: true
    }
  },
  methods: {
    // 处理输入
    handleSave () {
      this.$emit('save')
    }
  }
}
</script>

<style scoped lang="scss">
.translator {
  .translator-item {
    .code {
      font-size: 14px;
      em {
        color: #1e54d9;
        font-style: normal;
        &.keyword {
          font-weight: bold;
          color: #a90092;
        }
      }
    }
  }
}
</style>
