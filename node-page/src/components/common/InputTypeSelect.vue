<template>
  <el-select class="input-type-select" @change="$emit('change', $event)">
    <el-option value="input" label="Input"/>
    <el-option value="textarea" label="Textarea"/>
    <el-option value="select" label="Select"/>
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
