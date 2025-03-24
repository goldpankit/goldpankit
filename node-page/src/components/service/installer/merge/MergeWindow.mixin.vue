<template>

</template>

<script>

export default {
  name: 'MergeWindowMixin',
  data () {
    return {
      // 左侧树默认宽度百分比
      treeWidthPercent: 25,
      splitSizes: []
    }
  },
  computed: {
    // 计算左侧树透明度
    treeStyle () {
      if (this.splitSizes.length === 0) {
        return {
          opacity: 1,
          filter: 'none'
        }
      }
      // 开始模糊的百分比
      const minPercent = 15
      // 调整后的树宽度百分比 < 开始模糊的百分比，进行样式计算，改变透明度和模糊效果，让其更聚焦代码内容
      if (this.splitSizes[0] < minPercent) {
        let blur = Math.round((minPercent - this.splitSizes[0])/2)
        if (blur > 5) {
          blur = 5
        }
        // 按比例计算透明度
        let opacity = ((1 - (minPercent - this.splitSizes[0]) / 20) * 100)/100
        if (opacity < 0.5) {
          opacity = 0.5
        }
        return {
          opacity: opacity,
          filter: `blur(${blur}px)`
        }
      }
      return {
        opacity: 1,
        filter: 'none'
      }
    }
  },
  methods: {
    handleSplitDrag (sizes) {
      this.splitSizes = sizes
      this.$refs.previewWindow?.resize()
    }
  }
}
</script>

<style scoped lang="scss">

</style>
