<template>
  <ul v-if="options.length > 0" class="installer-radio">
    <li
      v-for="option in options" :key="option.value"
      :class="{ selected: modelValue === option.value }"
      @click="handleSelect(option.value)"
    >{{option.label}}</li>
  </ul>
  <p v-else>Please add options first.</p>
</template>

<script>
export default {
  name: "InstallRadio",
  props: {
    modelValue: {},
    options: {}
  },
  data () {
    return {
      optionSettingData: {
        visible: false
      }
    }
  },
  methods: {
    handleSelect (value) {
      this.$emit('update:modelValue', value)
      this.$emit('change', value)
    }
  },
  created () {
    console.log('radio value', this.modelValue)
  }
}
</script>

<style scoped lang="scss">
.installer-radio {
  display: flex;
  flex-wrap: wrap;
  line-height: initial;
  li {
    padding: 5px 10px;
    background-color: var(--background-color);
    margin-right: 10px;
    cursor: pointer;
    border: 1px solid var(--background-color);
    border-radius: 5px;
    &.selected {
      background: var(--color-value);
      color: var(--color-light);
      font-weight: bold;
      border-color: var(--color-value);
      &:hover {
        border-color: var(--color-value);
      }
    }
    &:hover {
      border-color: var(--primary-color);
    }
  }
}
.install-radio-select {
  display: flex;
  border: 1px solid var(--border-default-color);
  border-radius: 5px;
  overflow: hidden;
  :deep(.el-select) {
    flex-grow: 1;
  }
  .el-button {
    flex-shrink: 0;
    border: 0;
    border-left: 1px solid var(--border-default-color);
    border-radius: 0;
  }
}
</style>
