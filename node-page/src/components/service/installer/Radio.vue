<template>
  <template v-if="options.length > 0">
    <ul v-if="type === 'radio'" class="installer-checkbox">
      <li
        v-for="option in options" :key="option.value"
        :class="{ selected: modelValue === option.value }"
        @click="handleSelect(option.value)"
      >{{option.label}}</li>
    </ul>
    <el-select
      v-else
      :model-value="modelValue"
      @change="handleSelect"
    >
      <el-option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :label="option.label"
      />
    </el-select>
  </template>
  <p v-else>Please add options first.</p>
</template>

<script>
export default {
  name: "InstallRadio",
  props: {
    modelValue: {},
    options: {},
    // 取值select和radio
    type: {
      default: 'radio'
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
.installer-checkbox {
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
</style>
