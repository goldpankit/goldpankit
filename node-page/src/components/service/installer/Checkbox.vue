<template>
  <template v-if="options.length > 0">
    <ul v-if="type === 'checkbox'" class="installer-checkbox">
      <li
        v-for="option in options"
        :key="option.value"
        :class="{ selected: modelValue == null ? false : modelValue.findIndex(v => v === option.value) !== -1 }"
        @click="handleSelect(option)"
      >{{option.label}}</li>
    </ul>
    <el-select
      :model-value="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      multiple
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
  name: "InstallCheckbox",
  props: {
    modelValue: {
      type: Array
    },
    // 取值select和checkbox
    type: {
      default: 'checkbox'
    },
    options: {}
  },
  data () {
    return {
      selected: null
    }
  },
  methods: {
    handleSelect (option) {
      let index = this.modelValue.findIndex(v => v === option.value)
      if (index === -1) {
        this.$emit('update:modelValue', this.modelValue.concat([option.value]))
      } else {
        this.$emit('update:modelValue', this.modelValue.filter((item,i) => i !== index))
      }
    }
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
