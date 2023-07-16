<template>
  <ul v-if="options.length > 0" class="installer-checkbox">
    <li
      v-for="option in options" :key="option.value"
      :class="{ selected: (modelValue == null || modelValue === '') ? false : modelValue.findIndex(v => v === option.value) !== -1 }"
      @click="handleSelect(option)"
    >{{option.label}}</li>
  </ul>
  <p v-else>Please add options first.</p>
</template>

<script>
export default {
  name: "InstallCheckbox",
  props: {
    modelValue: {
      type: Array
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
      background: var(--primary-color-match-2);
      color: var(--color-light);
      font-weight: bold;
      border-color: var(--primary-color-match-2);
      &:hover {
        border-color: var(--primary-color-match-2);
      }
    }
    &:hover {
      border-color: var(--primary-color);
    }
  }
}
</style>
