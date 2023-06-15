<template>
  <div class="dynamic-width-input" :contenteditable="true" @input="handleInput">
    {{modelValue}}
  </div>
</template>

<script>
export default {
  name: "DynamicWidthInput",
  props: {
    modelValue: {}
  },
  methods: {
    handleInput (e) {
      this.$emit('update:modelValue', e.target.innerText)
    }
  }
}
</script>

<style scoped lang="scss">
.dynamic-width-input {
  display: inline-block;
  outline: none;
  background: #faebeb;
  border-radius: 5px;
  min-width: 30px;
  cursor: text;
  padding: 2px 5px;
}
</style>
