<template>
<!--  <el-select class="service-type-select">-->
<!--    <el-option value="MAIN" label="Main Service"/>-->
<!--    <el-option value="COMMON" label="Common Service"/>-->
<!--&lt;!&ndash;    <el-option value="LOGIC" label="Logic Service"/>&ndash;&gt;-->
<!--&lt;!&ndash;    <el-option value="PAGE" label="Page Service"/>&ndash;&gt;-->
<!--  </el-select>-->
  <el-radio-group>
    <el-radio label="MAIN">Main Service</el-radio>
    <el-radio label="COMMON">Common Service</el-radio>
  </el-radio-group>
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
