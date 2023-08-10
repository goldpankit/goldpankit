<template>
  <el-select class="data-source-type-select" :multiple="multiple">
    <el-option value="mysql" label="MySQL"/>
<!--    <el-option value="oracle" label="Oracle"/>-->
  </el-select>
</template>

<script>
export default {
  name: "DatabaseTypeSelect",
  props: {
    multiple: {
      default: true
    }
  }
}
</script>

<style scoped lang="scss">
.data-source-type-select {
  width: 100%;
}
</style>
