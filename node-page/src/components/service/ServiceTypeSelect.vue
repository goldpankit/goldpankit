<template>
  <el-radio-group>
    <el-radio label="MAIN">{{$t('service.mainService')}}</el-radio>
    <el-radio label="COMMON">{{$t('service.commonService')}}</el-radio>
  </el-radio-group>
</template>

<script>
export default {
  name: "ServiceTypeSelect"
}
</script>

<style scoped lang="scss">
.service-type-select {
  width: 100%;
}
</style>
