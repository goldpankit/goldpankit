<template>
  <h5>{{group.label}}</h5>
  <QueryModelFieldSelect
    ref="fieldSelect"
    v-model="selectedFields"
    :model="model"
    placeholder="Select fields"
    @fields:change="handleSelect"
  />
  <el-table
    v-if="group.children.length > 0"
    size="small"
    :data="group[valueKey]"
    :row-key="row => {
      return `${row.table.id}.${row.name}@${row.alias}`
    }"
    v-sortable:config="{
      data: group[valueKey],
      onChange: handleSort
    }"
  >
    <el-table-column width="25px" fixed>
      <SortableButton/>
    </el-table-column>
    <el-table-column label="字段名" width="150px" prop="name" fixed>
      <template #default="{row}">
        <p>
          {{row.table.alias}}.{{row.name}}
        </p>
        <p>{{row.comment}}</p>
      </template>
    </el-table-column>
    <el-table-column
      v-for="variable in group.children"
      :key="variable.name"
      :label="variable.label"
      :min-width="getColumnMinWidth(variable)"
    >
      <template #header>
        <em v-if="variable.required" class="required">*</em>
        <label>{{variable.label}}</label>
        <!-- 填写提示 -->
        <VariableRemarkIcon :variable="variable" />
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
import QueryModelFieldSelect from "@/components/database/query-model/FieldSelect.vue";
import SortableButton from "@/components/common/SortableButton.vue";
import {getDefaultEmptyValue, isEmptyValue} from '@/utils/variable'
import VariableRemarkIcon from "@/components/service/installer/VariableRemarkIcon.vue";

export default {
  name: "QueryModelFieldSetting",
  components: {VariableRemarkIcon, SortableButton, QueryModelFieldSelect, TableFieldVariableInput },
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
  watch: {
    model () {
      this.initSelectedFields()
    }
  },
  methods: {
    // 处理排序
    handleSort () {
      this.initSelectedFields()
      this.emitChange()
    },
    // 初始化字段选择
    initSelectedFields () {
      this.selectedFields = []
      const fields = this.group[this.valueKey]
      if (fields != null && fields.length > 0) {
        this.selectedFields = fields.map(f => `${f.table.id}.${f.name}`)
      }
    },
    // 字段选择
    handleSelect (fields) {
      // 补充好信息后的字段列表，注意此处不能直接使用fields，否则会丢失补充的信息
      const paddingFields = []
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
        paddingFields.push(field)
      }
      // 此处不能直接复制，需要保留引用，避免排序不生效
      this.group[this.valueKey].splice(0, this.group[this.valueKey].length)
      this.group[this.valueKey].push.apply(this.group[this.valueKey], paddingFields)
      this.emitChange()
    },
    // 出发变更事件
    emitChange () {
      this.$emit('change')
    },
    getColumnMinWidth (variable) {
      if (variable.inputType === 'select') {
        return '150px'
      }
      return '120px'
    },
    // 刷新字段设置内容
    refresh () {
      // 字段选择器：刷新模型表，刷新后会自动更新字段选择，影响列表中的字段
      this.$refs.fieldSelect.refreshTables()
    }
  },
  created () {
    this.initSelectedFields()
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
  // 关键字
  :deep(em) {
    color: var(--primary-color-match-2);
    font-weight: bold;
    font-style: normal;
  }
}
</style>
