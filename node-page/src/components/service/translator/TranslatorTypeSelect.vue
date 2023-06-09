<template>
  <el-select class="translator-type-select">
    <el-option value="pattern" label="Pattern"/>
    <el-option value="code" label="Code"/>
  </el-select>
</template>

<script>
export default {
  name: "TranslatorTypeSelect"
}
</script>

<style scoped lang="scss">
.translator-type-select {
  width: 100%;
}
</style>
