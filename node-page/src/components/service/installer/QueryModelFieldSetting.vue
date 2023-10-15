<template>
  <h5>{{group.label}}</h5>
  <QueryModelFieldSelect
    v-model="selectedFields"
    :model="model"
    placeholder="Select fields"
    @fields:change="handleSelect"
  />
  <el-table v-if="group.children.length > 0" size="small" :data="group[valueKey]">
    <el-table-column label="字段名" width="150px" prop="name" fixed>
      <template #default="{row}">
        {{row.table.alias}}.{{row.name}}
      </template>
    </el-table-column>
    <el-table-column
      v-for="variable in group.children"
      :key="variable.name"
      :label="variable.label"
      :min-width="getColumnMinWidth(variable)"
    >
      <template #header>
        <em v-if="variable.required" class="required">*</em>{{variable.label}}
      </template>
      <template #default="{ row }">
        <TableFieldVariableInput
          :variable="variable"
          v-model="row[variable.name]"
          @change="emitChange"
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
    model: {
      required: true
    },
    group: {
      required: true
    }
  },
  data () {
    return {
      selectedFields: []
    }
  },
  methods: {
    handleSelect (fields) {
      for (const field of fields) {
        // 增加字段原始信息
        if (field.origin == null) {
          field.origin = JSON.parse(JSON.stringify(field))
        }
        // 将字段变量添加到字段对象中，但需要保留原来的值
        for (const variable of this.group.children) {
          field[variable.name] = isEmptyValue(field[variable.name]) ? variable.defaultValue : field[variable.name]
          if (isEmptyValue(field[variable.name])) {
            field[variable.name] = getDefaultEmptyValue(variable.inputType)
          }
        }
      }
      this.group[this.valueKey] = fields
      this.emitChange()
    },
    emitChange () {
      this.$emit('change')
    },
    getColumnMinWidth (variable) {
      if (variable.inputType === 'select') {
        return '150px'
      }
      return '120px'
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
.el-table {
  :deep(.required) {
    color: var(--el-color-danger);
    margin-right: 2px;
    font-style: normal;
  }
}
</style>
