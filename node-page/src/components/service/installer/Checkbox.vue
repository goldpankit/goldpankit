<template>
  <ul class="installer-checkbox">
    <li
      v-for="option in options" :key="option.name"
      :class="{ selected: selected != null && selected.name === option.name }"
      @click="handleSelect(option)"
    >{{option.label}}</li>
  </ul>
</template>

<script>
export default {
  name: "InstallCheckbox",
  props: {
    modelValue: {},
    options: {}
  },
  data () {
    return {
      selected: null
    }
  },
  methods: {
    handleSelect (option) {
      this.selected = option
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
