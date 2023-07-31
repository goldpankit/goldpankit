<template>
  <InstallInput
    v-if="variable.inputType === 'input'"
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
  />
  <InstallNumberInput
    v-else-if="variable.inputType === 'number_input'"
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
  />
  <InstallInput
    v-else-if="variable.inputType === 'textarea'"
    type="textarea"
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
  />
  <InstallSelect
    v-else-if="variable.inputType === 'select'"
    :options="variable.options"
    :model-value="modelValue"
    @change="$emit('update:modelValue', $event)"
  />
  <InstallCheckbox
    v-else-if="variable.inputType === 'checkbox'"
    :options="variable.options"
    :model-value="modelValue"
    @change="$emit('update:modelValue', $event)"
  />
  <InstallRadio
    v-else-if="variable.inputType === 'radio'"
    :options="variable.options"
    :model-value="modelValue"
    @change="$emit('update:modelValue', $event)"
  />
</template>

<script>
import InstallInput from "./Input.vue";
import InstallRadio from "./Radio.vue";
import InstallCheckbox from "./Checkbox.vue";
import InstallSelect from "./Select.vue";
import InstallNumberInput from "./NumberInput.vue";

export default {
  name: "TableFieldVariableInput",
  components: {InstallNumberInput, InstallSelect, InstallCheckbox, InstallRadio, InstallInput},
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
