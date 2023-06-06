<template>
  <el-select
    class="mysql-field-select"
    popper-class="mysql-field-select__popper"
    :multiple="multiple"
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
    table: {
      required: true
    },
    multiple: {
      default: true
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
