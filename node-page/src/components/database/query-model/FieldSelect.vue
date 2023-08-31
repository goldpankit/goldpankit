<template>
  <el-select
    class="mysql-field-select"
    popper-class="mysql-field-select__popper"
    clearable
    :multiple="multiple"
    :model-value="modelValue == null ? [] : modelValue.map(f => f.table.alias + '.' + f.name)"
    @update:modelValue="handleInput"
  >
    <el-option-group
      v-for="fieldGroup in fieldGroups"
      :key="fieldGroup.alias"
      :label="`${fieldGroup.name} AS ${fieldGroup.alias}`"
    >
      <el-option
        v-for="field in fieldGroup.options"
        :value="fieldGroup.alias + '.' + field.name"
        :label="fieldGroup.alias + '.' + field.name"
      >
        <p class="option-content">
          <span>{{fieldGroup.alias}}.{{ field.name }}</span>
          <span class="text-info-1">{{ field.comment }}</span>
        </p>
      </el-option>
    </el-option-group>
  </el-select>
</template>

<script>
export default {
  name: "QueryModelFieldSelect",
  props: {
    modelValue: {},
    model: {
      required: true
    },
    multiple: {
      default: true
    }
  },
  computed: {
    fieldGroups () {
      let fieldGroups = []
      for (const table of this.model.tables) {
        const visibleFields = table.fields.filter(f => f.visible)
        if (visibleFields.length > 0) {
          fieldGroups.push({
            name: table.name,
            alias: table.alias,
            options: visibleFields
          })
        }
      }
      return fieldGroups
    },
    fields () {
      let fields = []
      for (const table of this.model.tables) {
        fields = fields.concat(table.fields)
      }
      return fields
    }
  },
  methods: {
    handleInput (fieldNames) {
      this.$emit('update:modelValue',
        fieldNames
          // 找到field对象并填充table字段
          .map(name => {
            // 选中的value值类似为xxxx.NAME，其中xxxx为表名，NAME为字段名称
            const tableName = name.split('.')[0]
            const fieldName = name.split('.')[1]
            // 找到字段所在的表
            const table = this.model.tables.find(t => t.alias === tableName)
            const tableDump = JSON.parse(JSON.stringify(table))
            // 找到字段
            const field = table.fields.find(field => field.name === fieldName)
            // 填充表信息（表信息中不要再包含字段信息，避免数据循环依赖）
            delete tableDump.fields
            field.table = tableDump
            return field
          })
          // 过滤掉未找到的对象
          .filter(field => field != null)
      )
    }
  }
}
</script>

<style scoped lang="scss">
.mysql-field-select {
  width: 100%;
}
</style>
<style lang="scss">
.mysql-field-select__popper {
  .option-content {
    display: flex;
    justify-content: space-between;
  }
}
</style>
