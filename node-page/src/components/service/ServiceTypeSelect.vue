<template>
  <el-select class="service-type-select">
    <el-option value="framework" label="Framework Service"/>
    <el-option value="common" label="Common Service"/>
    <el-option value="logic" label="Logic Service"/>
    <el-option value="page" label="Page Service"/>
  </el-select>
</template>

<script>
export default {
  name: "ServiceTypeSelect"
}
</script>

<style scoped lang="scss">
.service-type-select {
  width: 100%;
}
</style>
