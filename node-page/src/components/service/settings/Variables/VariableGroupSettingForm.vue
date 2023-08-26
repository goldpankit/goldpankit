<template>
  <el-form :model="variable">
<!--    <el-form-item label="Scope" required>-->
<!--      <el-radio-group v-model="variable.scope" @change="changeScope">-->
<!--        <el-radio label="service" border>Service</el-radio>-->
<!--        <el-radio label="table_field" border>Table Field</el-radio>-->
<!--        <el-radio label="query_model_field" border>Query Model Field</el-radio>-->
<!--      </el-radio-group>-->
<!--    </el-form-item>-->
    <el-form-item :label="$t('service.settings.variable.groupLabel')" required>
      <el-input v-model="variable.label" @input="handleChange"/>
    </el-form-item>
    <el-form-item :label="$t('service.settings.variable.groupName')" required>
      <el-input v-model="variable.name" @input="handleChange"/>
    </el-form-item>
  </el-form>
</template>

<script>
import InputTypeSelect from "../../../common/InputTypeSelect.vue";
import CompilerSelect from "../../../common/CompilerSelect.vue";
import VariableInput from "../../installer/VariableInput.vue";

export default {
  name: "VariableGroupSettingForm",
  components: {VariableInput, CompilerSelect, InputTypeSelect},
  props: {
    variable: {
      required: true
    }
  },
  methods: {
    // 切换作用域
    changeScope () {
      if (this.variable.type === 'group') {
        for (const v of this.variable.children) {
          v.scope = this.variable.scope
        }
      }
      this.handleChange()
    },
    handleChange () {
      this.$emit('change')
    }
  }
}
</script>

<style scoped>

</style>
