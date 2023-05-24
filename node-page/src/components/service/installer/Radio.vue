<template>
  <ul class="installer-checkbox">
    <li
      v-for="option in options" :key="option.value"
      :class="{ selected: modelValue === option.value }"
      @click="handleSelect(option)"
    >{{option.label}}</li>
  </ul>
</template>

<script>
export default {
  name: "InstallRadio",
  props: {
    modelValue: {},
    options: {}
  },
  methods: {
    handleSelect (option) {
      this.$emit('update:modelValue', option.value)
      this.$emit('change', option.value)
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
