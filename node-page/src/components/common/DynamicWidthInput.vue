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
      value: this.modelValue,
      oldValue: this.modelValue,
      changeTimeout: null
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

      // 一旦更新modelValue，会使得输入内容重新渲染，导致光标重新定位在文字开头
      // this.$emit('update:modelValue', this.value)

      if (this.changeTimeout != null) {
        clearTimeout(this.changeTimeout)
      }
      this.changeTimeout = setTimeout(() => {
        this.$emit('change', {
          oldValue: this.oldValue,
          newValue: e.target.innerText
        })
        this.oldValue = e.target.innerText
      }, 300)
    },
    // 失去焦点时修改焦点值，避免别名、字段名等信息通过v-model直接修改后导致表格重新渲染（会导致输入不连贯）
    handleBlur () {
      // 在失去焦点时更新modelValue，不进行实时更新，避免光标重新定位在文字开头
      this.$emit('update:modelValue', this.value)
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
  // background: #4c556e;
  background: #eee;
  border-radius: 5px;
  min-width: 30px;
  cursor: text;
  padding: 2px 5px;
  color: var(--font-color);
  white-space: nowrap;
}
</style>
