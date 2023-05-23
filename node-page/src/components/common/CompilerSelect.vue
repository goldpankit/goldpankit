<template>
  <el-select class="compiler-select" @change="$emit('change', $event)">
    <el-option v-if="withFollowService" value="" label="Follow Service"/>
    <el-option value="static" label="Static"/>
    <el-option value="freemarker" label="Freemarker"/>
  </el-select>
</template>

<script>
export default {
  name: "CompilerSelect",
  props: {
    withFollowService: {
      default: false
    }
  }
}
</script>

<style scoped lang="scss">
.compiler-select {
  width: 100%;
}
</style>
