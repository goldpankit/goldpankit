<template>
  <el-select class="input-type-select" @change="$emit('change', $event)">
    <el-option value="input" label="Input"/>
    <el-option value="textarea" label="Textarea"/>
    <el-option value="checkbox" label="Checkbox"/>
    <el-option value="radio" label="Radio"/>
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
