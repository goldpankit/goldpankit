<template>
  <el-select
    class="mysql-field-select"
    popper-class="mysql-field-select__popper"
    :multiple="multiple"
    :model-value="modelValue == null ? [] : modelValue.map(f => f.name)"
    @update:modelValue="handleInput"
  >
    <el-option v-for="field in table.fields" :value="field.name" :label="field.name">
      <p class="option-content">
        <span>{{ field.name }}</span>
        <span class="text-info-1">{{ field.comment }}</span>
      </p>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: "MySqlFieldSelect",
  props: {
    modelValue: {},
    table: {
      required: true
    },
    multiple: {
      default: true
    }
  },
  methods: {
    handleInput (fieldNames) {
      this.$emit('update:modelValue',
        fieldNames
          // 找到field对象
          .map(name => {
            return this.table.fields.find(field => field.name === name)
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
