<template>
  <el-select class="database-select">
    <el-option value="mysql" label="MySQL"/>
    <el-option value="oracle" label="Oracle"/>
  </el-select>
</template>

<script>
export default {
  name: "DatabaseSelect"
}
</script>

<style scoped lang="scss">
.database-select {
  width: 100%;
}
</style>
