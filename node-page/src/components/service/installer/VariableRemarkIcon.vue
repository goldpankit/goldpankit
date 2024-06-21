<template>
  <el-popover
    v-if="variable.remark != null && variable.remark.trim() !== ''"
    popper-class="global-popover"
    title="参数说明"
    placement="top"
    width="255px"
  >
    <p>{{variable.remark}}</p>
    <template #reference>
      <el-icon><QuestionFilled /></el-icon>
    </template>
  </el-popover>
</template>

<script>
export default {
  name: 'VariableRemarkIcon',
  props: {
    variable: {
      required: true
    }
  }
}
</script>
<style scoped lang="scss">
// 说明图标
.el-icon {
  color: #999;
  font-size: 16px;
  margin-left: 3px;
  &:hover {
    color: #555;
  }
}
</style>
