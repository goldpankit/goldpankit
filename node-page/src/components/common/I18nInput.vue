<template>
  <div class="i18n-input">
    <ul>
      <li class="selected">中文</li>
      <li>English</li>
    </ul>
    <el-input
      v-if="type === 'text'"
      :maxlength="maxlength"
      :model-value="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
    />
    <el-input
      v-else-if="type === 'textarea'"
      type="textarea"
      resize="none"
      :rows="rows"
      :maxlength="maxlength"
      :model-value="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script>
export default {
  name: 'I18nInput',
  props: {
    modelValue: {},
    type: {
      default: 'text'
    },
    // 最大输入长度
    maxlength: {
      default: null
    },
    // textarea配置
    rows: {
      default: 5
    },
    resize: {
      default: 'none'
    }
  },
  methods: {
    handleInput (value) {
      console.log('value', value)
      this.$emit('update:modelValue', value)
    }
  }
}
</script>

<style scoped lang="scss">
.i18n-input {
  width: 100%;
  display: flex;
  flex-direction: column;
  & > ul {
    display: flex;
    li {
      margin-right: 10px;
      cursor: default;
      &.selected {
        font-weight: bold;
      }
    }
  }
}
</style>
