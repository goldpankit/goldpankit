<template>
  <el-select class="translator-type-select">
    <el-option value="pattern" :label="$t('service.settings.translator.pattern')"/>
    <el-option value="code" :label="$t('service.settings.translator.code')"/>
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
