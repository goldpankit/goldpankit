<template>
  <el-select class="input-type-select">
    <el-option value="input" label="Input"/>
    <el-option value="textarea" label="Textarea"/>
    <el-option value="select" label="Select"/>
    <el-option value="checkbox" label="Checkbox"/>
    <el-option value="radio" label="Radio"/>
    <template v-if="!withGroup">
      <el-option value="database" label="Database"/>
      <el-option value="table" label="Table"/>
      <el-option value="query_model" label="Query Model"/>
    </template>
  </el-select>
</template>

<script>
export default {
  name: "InputTypeSelect",
  props: {
    // 是否为组内变量选择，如果是，不会展示
    withGroup: {
      default: false
    }
  }
}
</script>

<style scoped lang="scss">
.input-type-select {
  width: 100%;
}
</style>
