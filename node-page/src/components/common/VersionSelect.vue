<template>
  <el-select class="version-select">
    <el-option label="V1" value="v1"/>
    <el-option label="V2" value="v2"/>
    <el-option label="V3" value="v3"/>
    <el-option label="V4" value="v4"/>
    <el-option label="V5" value="v5"/>
  </el-select>
</template>

<script>
export default {
  name: "VersionSelect"
}
</script>

<style scoped lang="scss">
.version-select {
  width: 100%;
}
</style>
