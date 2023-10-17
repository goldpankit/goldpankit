<template>
  <InstallInput
    v-if="variable.inputType === 'input'"
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    @input="$emit('change', $event)"
  />
  <InstallNumberInput
    v-else-if="variable.inputType === 'number_input'"
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    @input="$emit('change', $event)"
  />
  <InstallInput
    v-else-if="variable.inputType === 'textarea'"
    type="textarea"
    :rows="1"
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    @input="$emit('change', $event)"
  />
  <InstallSelect
    v-else-if="variable.inputType === 'select'"
    :options="variable.options"
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    @change="$emit('change', $event)"
  />
  <InstallCheckbox
    v-else-if="variable.inputType === 'checkbox'"
    :options="variable.options"
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    @change="$emit('change', $event)"
  />
  <InstallRadio
    v-else-if="variable.inputType === 'radio'"
    :options="variable.options"
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    @change="$emit('change', $event)"
  />
  <InstallSwitch
    v-else-if="variable.inputType === 'switch'"
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    @change="$emit('change', $event)"
  />
</template>

<script>
import InstallInput from "./Input.vue";
import InstallRadio from "./Radio.vue";
import InstallCheckbox from "./Checkbox.vue";
import InstallSelect from "./Select.vue";
import InstallNumberInput from "./NumberInput.vue";
import InstallSwitch from "@/components/service/installer/Switch.vue";

export default {
  name: "TableFieldVariableInput",
  components: {
    InstallSwitch,
    InstallNumberInput,
    InstallSelect,
    InstallCheckbox,
    InstallRadio,
    InstallInput
  },
  props: {
    modelValue: {},
    variable: {
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
* {
  z-index: 0;
}
</style>
