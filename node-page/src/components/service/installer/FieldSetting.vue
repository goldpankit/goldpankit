<template>
  <h5>{{group.label}}</h5>
  <MySqlFieldSelect
    @update:modelValue="handleSelect"
    :model-value="group[valueKey]"
    :table="table"
    placeholder="请选择字段"
  />
  <el-table size="small" :data="group[valueKey]">
    <el-table-column label="字段名" width="100px" prop="name" fixed></el-table-column>
    <el-table-column
      v-for="variable in group.children"
      :key="variable.name"
      :label="variable.label"
      :min-width="getColumnMinWidth(variable)"
    >
      <template #header>
        <div class="column-header-wrap">
          <em v-if="variable.required" class="required">*</em>
          <label>{{variable.label}}</label>
          <!-- 填写提示 -->
          <VariableRemarkIcon :variable="variable" />
        </div>
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
import MySqlFieldSelect from '@/components/database/MySqlFieldSelect'
import TableFieldVariableInput from './TableFieldVariableInput'
import VariableRemarkIcon from '@/components/service/installer/VariableRemarkIcon'
import { getDefaultEmptyValue, isEmptyValue } from '@/utils/variable'

export default {
  name: 'FieldSetting',
  components: { VariableRemarkIcon, TableFieldVariableInput, MySqlFieldSelect },
  props: {
    // 表对象
    table: {
      required: true
    },
    // 变量组对象
    group: {
      required: true
    },
    // 变量组存放值的字段名称
    valueKey: {
      default: 'value'
    }
  },
  computed: {
    tableFields () {
      return this.table.fields.map(field => field.name)
    }
  },
  watch: {
    // 监听表字段，如果发生变化，重新触发选中事件
    tableFields () {
      this.handleSelect(this.group[this.valueKey])
    }
  },
  methods: {
    /**
     * 触发选中
     * 添加字段原始信息，方便后期获取；将字段变量组中的动态变量添加到字段中
     *
     * @param fields 选中的字段
     */
    handleSelect (fields) {
      // 过滤掉实际表中不存在的字段（当数据库表字段发生了变化，此项操作可实现更新字段选择）
      fields = fields.filter(field => {
        return this.table.fields.find(v => v.name === field.name) != null
      })
      const copyFields = JSON.parse(JSON.stringify(fields))
      for (const field of copyFields) {
        // 增加字段原始信息
        if (field.origin == null) {
          field.origin = JSON.parse(JSON.stringify(field))
        }
        // 将动态的字段变量添加到字段对象中，但需要保留原来的值
        for (const variable of this.group.children) {
          field[variable.name] = isEmptyValue(field[variable.name]) ? variable.defaultValue : field[variable.name]
          if (isEmptyValue(field[variable.name])) {
            field[variable.name] = getDefaultEmptyValue(variable.inputType)
          }
        }
      }
      this.group[this.valueKey] = copyFields
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
  },
  created () {
    // 初始化时，触发一次change操作，更新表字段选择
    this.handleSelect(this.group[this.valueKey])
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
  margin-top: 10px;
  // 列头
  :deep(.column-header-wrap) {
    display: flex;
    align-items: center;
    // 必填
    .required {
      color: var(--el-color-danger);
      margin-right: 2px;
      font-style: normal;
    }
  }
}
</style>
