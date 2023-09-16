<template>
  <div class="search-input">
    <input
      :value="modelValue"
      :placeholder="placeholder"
      @keypress.enter="search"
      @input="handleInput"
    />
    <el-icon><Search /></el-icon>
  </div>
</template>

<script>

export default {
  name: "SearchInput",
  props: {
    modelValue: {
      required: true
    },
    placeholder: {
    }
  },
  methods: {
    search () {
      this.$emit('search')
    },
    handleInput (e) {
      this.$emit('update:modelValue', e.target.value)
    }
  }
}
</script>

<style scoped lang="scss">
// 搜索
.search-input {
  position: relative;
  input {
    outline: none;
    width: 100%;
    border: 1px solid #ccc;
    padding: 8px 15px;
    box-sizing: border-box;
    border-radius: 30px;
    &:focus {
      border-color: var(--primary-color);
    }
  }
  .el-icon {
    position: absolute;
    top: 2px;
    right: 10px;
    font-size: 16px;
    color: var(--color-gray);
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &:hover {
      color: var(--font-color);
    }
  }
}
</style>
