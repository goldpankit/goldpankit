<template>
  <h5>{{group.label}}</h5>
  <QueryModelFieldSelect
    :model="table"
    :model-value="group[valueKey]"
    placeholder="Select fields"
    @update:modelValue="handleSelect"
  />
  <el-table size="small" :data="group[valueKey]">
    <el-table-column label="字段名" width="100px" prop="name" fixed>
      <template #default="{row}">
        {{row.name}}
      </template>
    </el-table-column>
    <el-table-column
      v-for="variable in group.children"
      :key="variable.name"
      :label="variable.label"
    >
      <template #default="{ row }">
        <TableFieldVariableInput
          :variable="variable"
          v-model="row[variable.name]"
        />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import TableFieldVariableInput from "./TableFieldVariableInput.vue";
import QueryModelFieldSelect from "../../database/query-model/FieldSelect.vue";
import {getDefaultEmptyValue, isEmptyValue} from '../../../utils/variable'

export default {
  name: "QueryModelFieldSetting",
  components: {QueryModelFieldSelect, TableFieldVariableInput },
  props: {
    valueKey: {
      default: 'value'
    },
    table: {
      required: true
    },
    group: {
      required: true
    }
  },
  methods: {
    handleSelect (fields) {
      for (const field of fields) {
        // 将字段变量添加到字段对象中，但需要保留原来的值
        for (const variable of this.group.children) {
          field[variable.name] = isEmptyValue(field[variable.name]) ? variable.defaultValue : field[variable.name]
          if (isEmptyValue(field[variable.name])) {
            field[variable.name] = getDefaultEmptyValue(variable.inputType)
          }
        }
      }
      this.group[this.valueKey] = fields
    }
  }
}
</script>

<style scoped lang="scss">
h5 {
  font-size: var(--font-size);
  color: var(--el-text-color-regular);
  font-weight: normal;
  margin-top: 20px;
}
</style>
