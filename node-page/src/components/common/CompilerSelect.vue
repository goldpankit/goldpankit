<template>
  <el-select
    class="compiler-select"
    clearable
    :model-value="modelValue"
    @update:model-value="$emit('update:model-value', $event)"
    @change="$emit('change', $event)"
  >
    <el-option value="static" label="Static"/>
    <el-option value="freemarker" label="Freemarker"/>
  </el-select>
  <FormItemTip :content="tip"/>
</template>

<script>
import FormItemTip from "@/components/common/FormItemTip.vue";

export default {
  name: 'CompilerSelect',
  components: {FormItemTip},
  props: {
    modelValue: {}
  },
  computed: {
    tip () {
      if (this.modelValue == null || this.modelValue === '') {
        return "当前编译器跟随服务或插件的编译器设定！"
      }
      if (this.modelValue === 'static') {
        return '当前选择为静态编译器，将保留文件原始内容！'
      }
      return '当前选择为Freemarker编译器，文件内容将采用Freemarker语法进行编译！'
    }
  }
}
</script>

<style scoped lang="scss">
.compiler-select {
  width: 100%;
}
</style>
