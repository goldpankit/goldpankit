<template>
  <el-select class="build-command-type-select">
    <el-option value="Node" label="Node"/>
    <el-option value="MySQL" label="MySQL"/>
  </el-select>
</template>

<script>
export default {
  name: "BuildCommandTypeSelect"
}
</script>

<style scoped lang="scss">
.build-command-type-select {
  width: 100%;
}
</style>
