<template>
  <div class="option-value-input">
    <el-input
      v-if="optionSetting.inputType === 'input'"
      :model-value="modelValue"
      @update:model-value="emitChange"
    />
    <el-input-number
      v-else-if="optionSetting.inputType === 'number_input'"
      :model-value="modelValue"
      :controls="false"
      @update:model-value="emitChange"
    />
    <el-input
      v-else-if="optionSetting.inputType === 'textarea'"
      type="textarea"
      :rows="1"
      :model-value="modelValue"
      @update:model-value="emitChange"
    />
  </div>
</template>

<script>

export default {
  name: "OptionValueInput",
  props: {
    modelValue: {},
    optionSetting: {
      required: true
    }
  },
  methods: {
    emitChange (e) {
      this.$emit('update:model-value', e)
      this.$emit('input', e)
    }
  }
}
</script>

<style scoped lang="scss">
.option-value-input {
  width: 100%;
  & > * {
    width: 100%;
  }
  :deep(.el-input-number) {
    .el-input__wrapper {
      padding: 0 11px;
    }
    .el-input__inner {
      text-align: left;
    }
  }
}
</style>
