<template>
  <span class="lang-icon" :style="{ width: size, height: size }">
    <i :class="`language lang-file lang-${suffix}`"></i>
  </span>
</template>

<script>
/**
 * 注意：请确保lang-file在iconfont.css的最顶部
 */
export default {
  name: 'LangIcon',
  props: {
    // 语言后缀
    suffix: {
      type: String,
      require: true
    },
    // 尺寸
    size: {
      default: '20px'
    }
  }
}
</script>

<style scoped lang="scss">
.lang-icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  .language {
    font-size: 14px;
  }
}
</style>
