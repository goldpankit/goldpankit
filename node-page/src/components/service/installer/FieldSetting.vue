<template>
  <h5>查询条件字段设置</h5>
  <MySqlFieldSelect :table="table" placeholder="Select fields"/>
  <el-table>
    <el-table-column label="字段名" fixed></el-table-column>
    <el-table-column label="是否必填"></el-table-column>
    <el-table-column label="输入类型"></el-table-column>
    <el-table-column label="验证方式"></el-table-column>
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
