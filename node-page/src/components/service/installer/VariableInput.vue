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
    variable: {
      required: true
    },
    valueKey: {
      default: 'value'
    }
  },
  computed: {
    inputType () {
      return this.variable.inputType
    }
  },
  watch: {
    inputType (newValue) {
      // 数组类型
      if (newValue === 'checkbox') {
        if (typeof this.variable[this.valueKey] === 'string') {
          this.variable[this.valueKey] = []
        }
      }
      // 非数组类型
      else {
        const value = this.variable[this.valueKey]
        if (value instanceof Array) {
          this.variable[this.valueKey] = value[0] || ''
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
