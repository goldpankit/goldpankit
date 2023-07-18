<template>
  <el-select class="input-type-select">
    <el-option value="input" label="Input"/>
    <el-option value="textarea" label="Textarea"/>
    <el-option value="checkbox" label="Checkbox"/>
    <el-option value="radio" label="Radio"/>
    <el-option value="database" label="Database"/>
    <el-option value="table" label="Table"/>
    <el-option value="query_model" label="Query Model"/>
  </el-select>
</template>

<script>
export default {
  name: "InputTypeSelect"
}
</script>

<style scoped lang="scss">
.input-type-select {
  width: 100%;
}
</style>
