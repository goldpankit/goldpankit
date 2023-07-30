<template>
  <el-input
    v-if="optionSetting.inputType === 'input'"
    :model-value="modelValue"
    @update:model-value="emitChange"
  />
  <el-input-number
    v-else-if="optionSetting.inputType === 'number_input'"
    :model-value="modelValue"
    @update:model-value="emitChange"
  />
  <el-input
    v-else-if="optionSetting.inputType === 'textarea'"
    type="textarea"
    :rows="1"
    :model-value="modelValue"
    @update:model-value="emitChange"
  />
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

</style>
