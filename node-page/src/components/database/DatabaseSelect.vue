<template>
  <el-select class="database-select" :multiple="multiple">
    <el-option value="mysql" label="MySQL"/>
<!--    <el-option value="oracle" label="Oracle"/>-->
  </el-select>
</template>

<script>
export default {
  name: "DatabaseSelect",
  props: {
    multiple: {
      default: true
    }
  }
}
</script>

<style scoped lang="scss">
.database-select {
  width: 100%;
}
</style>
