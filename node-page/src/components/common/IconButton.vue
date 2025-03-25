<template>
  <span
    class="icon-button"
    :class="{ selected: isSwitch && modelValue }"
    @click="handleSwitch"
  >
    <Icon :value="value"/>
  </span>
</template>

<script>

export default {
  name: "IconButton",
  props: {
    modelValue: {
      default: false,
      type: Boolean
    },
    // 是否为开关，开启后点击变量，再点击变暗
    isSwitch: {
      default: false
    },
    // 图标值，可为class、Element Plus图标和路径图标
    value: {
      type: String
    },
    // 尺寸
    size: {
      default: 'inherit'
    }
  },
  methods: {
    // 切换开关
    handleSwitch () {
      if (this.isSwitch) {
        this.$emit('update:modelValue', !this.modelValue)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.icon-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    :deep(.icon) {
      color: var(--primary-color);
    }
  }
  &.selected {
    :deep(.icon) {
      color: var(--primary-color-match-2);
    }
    &:hover {
      :deep(.icon) {
        color: var(--primary-color-match-2);
      }
    }
  }
}
</style>
