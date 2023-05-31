<template>
  <el-select class="service-type-select">
    <el-option value="MAIN" label="Main Service"/>
    <el-option value="COMMON" label="Common Service"/>
<!--    <el-option value="LOGIC" label="Logic Service"/>-->
<!--    <el-option value="PAGE" label="Page Service"/>-->
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
