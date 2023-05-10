<template>
  <el-select class="database-select">
    <el-option value="static" label="Static"/>
    <el-option value="freemarker" label="Freemarker"/>
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
