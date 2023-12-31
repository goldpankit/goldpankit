<template>
  <template v-if="options.length > 0">
    <ul class="installer-checkbox">
      <li
        v-for="option in options"
        :key="option.value"
        :class="{ selected: modelValue == null ? false : modelValue.findIndex(v => v === option.value) !== -1 }"
        @click="handleSelect(option)"
      >{{option.label}}</li>
    </ul>
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
    }
  },
  computed: {
    optionValues () {
      return this.options.map(opt => opt.value)
    }
  },
  watch: {
    // 当值发生变化时，触发handleSelect，避免不存在值继续被选中
    modelValue: {
      immediate: true,
      handler () {
        this.filterValues(this.modelValue)
      }
    },
    // 当选项列表发生变化时，触发handleSelect，避免不存在值继续被选中
    optionValues () {
      this.filterValues(this.modelValue)
    }
  },
  methods: {
    handleSelect (option) {
      let index = this.modelValue.findIndex(v => v === option.value)
      let values = []
      if (index === -1) {
        values = this.modelValue.concat([option.value])
      } else {
        values = this.modelValue.filter((item,i) => i !== index)
      }
      // 过滤掉不存在的值
      this.filterValues(values)
    },
    // 过滤掉不存在的值
    filterValues (values) {
      const selectedValues = []
      for (const value of values) {
        const targetOption = this.options.find(opt => opt.value === value)
        if (targetOption != null) {
          selectedValues.push(value)
        }
      }
      /**
       * 因为每次处理选中的值都是一个新的数组，所以modelValue会被监听到变化，而监听到变化后又会触发
       * 过滤，所以此处要判断过滤后的值是否和modelValue是一致的，如果是一致的，则不再触发更新
       */
      if (selectedValues === this.modelValue) {
        return
      }
      if (selectedValues != null && this.modelValue != null && selectedValues.join(',') === this.modelValue.join(',')) {
        return
      }
      this.$emit('update:modelValue', selectedValues)
      this.$emit('change', selectedValues)
    }
  }
}
</script>

<style scoped lang="scss">
.installer-checkbox {
  --color-value: var(--primary-color-match-1);
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
      color: var(--font-color);
      background: var(--color-value);
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
