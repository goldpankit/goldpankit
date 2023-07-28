<template>
  <el-select
    class="mysql-field-select"
    popper-class="mysql-field-select__popper"
    :multiple="multiple"
    :model-value="modelValue == null ? [] : modelValue.map(f => f.name)"
    @update:modelValue="handleInput"
  >
    <el-option-group
      v-for="fieldGroup in fieldGroups"
      :key="fieldGroup.label"
      :label="fieldGroup.label"
    >
      <el-option v-for="field in fieldGroup.options" :value="field.name" :label="fieldGroup.label + '.' + field.name">
        <p class="option-content">
          <span>{{fieldGroup.label}}.{{ field.name }}</span>
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
        fieldGroups.push({
          label: table.name,
          options: table.fields
        })
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
          // 找到field对象
          .map(name => {
            return this.fields.find(field => field.name === name)
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
