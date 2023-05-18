<template>
  <el-select class="compiler-select" @change="$emit('change', $event)">
    <el-option value="static" label="Static"/>
    <el-option value="freemarker" label="Freemarker"/>
  </el-select>
</template>

<script>
export default {
  name: "CompilerSelect"
}
</script>

<style scoped lang="scss">
.compiler-select {
  width: 100%;
}
</style>
