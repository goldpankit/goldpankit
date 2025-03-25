<template>
  <!-- Element Plus图标 -->
  <el-icon v-if="iconType === 'ELEMENT_PLUS'" class="icon" :size="size" @click="$emit('click', $event)">
    <component :is="icon"/>
  </el-icon>
  <!-- 路径图标 -->
  <img
    v-else-if="iconType === 'URI'"
    class="icon image-icon"
    :src="icon"
    alt="未知"
    :style="{ width: sizeWidth, height: sizeWidth }"
    @click="$emit('click', $event)"
  />
  <!-- class图标 -->
  <i
    v-else-if="iconType === 'CLASS'"
    class="icon"
    :class="icon"
    :style="{ 'font-size': size }"
    @click="$emit('click', $event)"
  ></i>
  <!-- 不正确的图标 -->
  <span v-else class="icon holder" :style="{ width: sizeWidth, height: sizeWidth }"><em>x</em></span>
</template>

<script>

export default {
  name: 'Icon',
  props: {
    // 图标值，可为class、Element Plus图标和路径图标
    value: {
      type: String
    },
    // 尺寸
    size: {
      default: 'inherit'
    }
  },
  computed: {
    // size对应的width值
    sizeWidth () {
      if (this.size === 'inherit') {
        return '16px'
      }
      return this.size
    },
    // 图标
    icon () {
      if (this.value != null) {
        return this.value
      }
      return ''
    },
    // 图标类型
    iconType () {
      if (!this.icon) {
        return ''
      }
      const expression = /^[A-Z].*/
      // Element Plus图标
      if (expression.test(this.icon)) {
        return 'ELEMENT_PLUS'
      }
      // 路径图标
      if (
        this.icon.startsWith('http://') ||
        this.icon.startsWith('https://') ||
        this.icon.startsWith('/')
      ) {
        return 'URI'
      }
      // CLASS图标
      if (this.icon.split(' ').length === 2) {
        return 'CLASS'
      }
      return ''
    }
  }
}
</script>

<style scoped lang="scss">
.icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
// 图片图标
.image-icon {
  object-fit: cover;
}
// 占位图标
.holder {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: red !important;
  background: var(--background-color);
  em {
    position: relative;
    top: -1px;
    font-style: normal;
  }
}
</style>
