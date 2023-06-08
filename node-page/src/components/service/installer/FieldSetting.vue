<template>
  <h5>{{variableSetting.label}}</h5>
  <MySqlFieldSelect :table="table" placeholder="Select fields"/>
  <el-table>
    <el-table-column label="字段名" fixed></el-table-column>
    <el-table-column
      v-for="variable in variableSetting.children"
      :key="variable.name"
      :label="variable.label"
    ></el-table-column>
  </el-table>
</template>

<script>
import MySqlFieldSelect from "../../database/MySqlFieldSelect.vue";

export default {
  name: "FieldSetting",
  components: {MySqlFieldSelect},
  props: {
    table: {
      required: true
    },
    variableSetting: {
      required: true
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
