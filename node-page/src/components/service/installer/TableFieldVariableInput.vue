<template>
  <InstallInput
    v-if="variable.inputType === 'input'"
    :model-value="modelValue"
    @change="$emit('update:modelValue', $event)"
  />
  <InstallInput
    v-else-if="variable.inputType === 'textarea'"
    type="textarea"
    :model-value="modelValue"
    @change="$emit('update:modelValue', $event)"
  />
  <InstallCheckbox
    v-else-if="variable.inputType === 'checkbox'"
    type="select"
    :options="variable.options"
    :model-value="modelValue"
    @change="$emit('update:modelValue', $event)"
  />
  <InstallRadio
    v-else-if="variable.inputType === 'radio'"
    type="select"
    :options="variable.options"
    :model-value="modelValue"
    @change="$emit('update:modelValue', $event)"
  />
</template>

<script>
import InstallInput from "./Input.vue";
import InstallRadio from "./Radio.vue";
import InstallCheckbox from "./Checkbox.vue";

export default {
  name: "TableFieldVariableInput",
  components: {InstallCheckbox, InstallRadio, InstallInput},
  props: {
    modelValue: {},
    variable: {
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
</style>
