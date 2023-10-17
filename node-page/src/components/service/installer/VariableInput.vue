<template>
  <div class="variable-input">
    <InstallInput
      v-if="variable.inputType === 'input'"
      v-model="variable[valueKey]"
      @input="$emit('change', $event)"
    />
    <InstallNumberInput
      v-else-if="variable.inputType === 'number_input'"
      v-model="variable[valueKey]"
      @input="$emit('change', $event)"
    />
    <InstallInput
      v-else-if="variable.inputType === 'textarea'"
      type="textarea"
      v-model="variable[valueKey]"
      @input="$emit('change', $event)"
    />
    <InstallSelect
      v-else-if="variable.inputType === 'select'"
      v-model="variable[valueKey]"
      :options="variable.options"
      @change="$emit('change', $event)"
    />
    <InstallCheckbox
      v-else-if="variable.inputType === 'checkbox'"
      v-model="variable[valueKey]"
      :options="variable.options"
      @change="$emit('change', $event)"
    />
    <InstallRadio
      v-else-if="variable.inputType === 'radio'"
      v-model="variable[valueKey]"
      :options="variable.options"
      @change="$emit('change', $event)"
    />
    <InstallSwitch
      v-else-if="variable.inputType === 'switch'"
      v-model="variable[valueKey]"
      @input="$emit('change', $event)"
    />
    <DataSourceSelect
      v-else-if="variable.inputType === 'datasource'"
      v-model="variable[valueKey]"
      :with-prefix="false"
      :with-block="true"
      @change="$emit('change', $event)"
    />
    <TableSelect
      v-else-if="variable.inputType === 'table'"
      :variable="variable"
      :value-key="valueKey"
      v-model="variable[valueKey]"
      @change="$emit('change', $event)"
    />
    <QueryModelSelect
      v-else-if="variable.inputType === 'query_model'"
      :variable="variable"
      :value-key="valueKey"
      v-model="variable[valueKey]"
      @change="$emit('change', $event)"
    />
  </div>
</template>

<script>
import InstallInput from "./Input.vue";
import InstallRadio from "./Radio.vue";
import InstallCheckbox from "./Checkbox.vue";
import TableSelect from "../../common/TableSelect.vue";
import QueryModelSelect from "../../database/query-model/QueryModelSelect.vue";
import DataSourceSelect from "../../database/DataSourceSelect.vue";
import InstallSelect from "./Select.vue";
import InstallNumberInput from "./NumberInput.vue";
import InstallSwitch from "./Switch.vue";

export default {
  name: "VariableInput",
  components: {
    InstallNumberInput,
    InstallSelect,
    DataSourceSelect,
    QueryModelSelect,
    TableSelect,
    InstallCheckbox,
    InstallRadio,
    InstallInput,
    InstallSwitch
  },
  props: {
    // 当前变量
    variable: {
      required: true
    },
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

<style scoped lang="scss">
.variable-input {
  width: 100%;
  :deep(.install-radio-select) {
    width: 100%;
  }
  :deep(.install-checkbox-select) {
    width: 100%;
  }
  :deep(.install-number-input) {
    width: 100%;
  }
}
</style>
