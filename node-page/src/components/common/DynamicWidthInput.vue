<template>
  <div
    class="dynamic-width-input"
    :contenteditable="true"
    @input="handleInput"
    @blur="handleBlur"
  >
    {{modelValue}}
  </div>
</template>

<script>
export default {
  name: "DynamicWidthInput",
  props: {
    modelValue: {
    }
  },
  data () {
    return {
      value: this.modelValue
    }
  },
  watch: {
    modelValue: {
      immediate: true,
      handler () {
        this.value = this.modelValue
      }
    }
  },
  methods: {
    handleInput (e) {
      this.value = e.target.innerText
      this.$emit('update:modelValue', e.target.innerText)
      this.$emit('change', e.target.innerText)
    },
    // 失去焦点时修改焦点值，避免别名、字段名等信息通过v-model直接修改后导致表格重新渲染（会导致输入不连贯）
    handleBlur () {
      this.$emit('update:blur-model-value', this.value)
      this.$emit('blur')
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
