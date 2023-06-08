<template>
  <InstallInput
    v-if="variable.inputType === 'input'"
    v-model="variable[valueKey]"
    @input="$emit('change', $event)"
  />
  <InstallCheckbox
    v-else-if="variable.inputType === 'checkbox'"
    v-model="variable[valueKey]"
    :options="variable.options"
  />
  <InstallRadio
    v-else-if="variable.inputType === 'radio'"
    v-model="variable[valueKey]"
    :options="variable.options"
  />
  <TableSelect
    v-else-if="variable.inputType === 'table'"
    :variables="variables"
    :value-key="valueKey"
    v-model="variable[valueKey]"
  />
</template>

<script>
import InstallInput from "./Input.vue";
import InstallRadio from "./Radio.vue";
import InstallCheckbox from "./Checkbox.vue";
import TableSelect from "../../common/TableSelect.vue";

export default {
  name: "VariableInput",
  components: {TableSelect, InstallCheckbox, InstallRadio, InstallInput},
  props: {
    // 当前变量
    variable: {
      required: true
    },
    // 变量列表，用于实现TableSelect的字段变量
    variables: {},
    // 变量值字段
    valueKey: {
      default: 'value'
    }
  },
  computed: {
    inputType () {
      return this.variable.inputType
    }
  }
}
</script>

<style scoped>

</style>
