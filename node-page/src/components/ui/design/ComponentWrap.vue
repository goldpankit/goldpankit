<template>
  <div class="component-wrap" :class="{ selected }" @click="selected = !selected">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "ComponentWrap",
  data () {
    return {
      selected: false
    }
  }
}
</script>

<style scoped lang="scss">
.component-wrap {
  display: inline-block;
  border: 2px solid transparent;
  &.selected {
    border-color: var(--primary-color-match-2);
  }
}
</style>
