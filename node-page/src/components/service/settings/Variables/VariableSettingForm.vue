<template>
  <el-form :model="variable">
    <el-form-item v-if="!withGroup" label="Scope" required>
      <el-radio-group v-model="variable.scope" @change="handleChange">
        <el-radio label="service" border>Service</el-radio>
        <el-radio label="table_field" border>Table Field</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="Label" required>
      <I18nInput v-model="variable.label" @input="handleChange"/>
    </el-form-item>
    <el-form-item label="Name" required>
      <el-input v-model="variable.name" @input="handleChange"/>
    </el-form-item>
    <el-form-item label="Input Type" required>
      <InputTypeSelect v-model="variable.inputType" @change="handleChange"/>
    </el-form-item>
    <el-form-item
      v-if="variable.inputType === 'checkbox' || variable.inputType === 'radio'"
      label="Options"
      class="item-options"
      required
    >
      <template #label>
        <div>
          <label>Options</label>
          <div class="opera">
            <el-button icon="Top" class="button-icon"></el-button>
            <el-button icon="Bottom" class="button-icon"></el-button>
            <el-button @click="createOption">Add</el-button>
          </div>
        </div>
      </template>
      <el-table :data="variable.options">
        <el-table-column label="*Label" min-width="200px">
          <template #default="{ row }">
            <el-input v-model="row.label" type="textarea" :rows="1" @input="handleChange"/>
          </template>
        </el-table-column>
        <el-table-column label="*Value" min-width="120px">
          <template #default="{ row }">
            <el-input v-model="row.value" @input="handleChange"/>
          </template>
        </el-table-column>
        <el-table-column label="Remark" min-width="150px">
          <template #default="{ row }">
            <el-input v-model="row.remark" type="textarea" :rows="1" @input="handleChange"/>
          </template>
        </el-table-column>
        <el-table-column v-if="variable.options.length > 0" min-width="60px" fixed="right">
          <template #default="{ row, index }">
            <el-button icon="Delete" class="button-icon" @click="deleteOption(index)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item label="Default Value">
      <VariableInput :variable="variable" value-key="defaultValue" @change="handleChange"/>
    </el-form-item>
    <el-form-item label="Required">
      <el-switch v-model="variable.required" @change="handleChange"/>
    </el-form-item>
    <el-form-item label="Hidden">
      <el-switch v-model="variable.hidden" @change="handleChange"/>
    </el-form-item>
    <el-form-item label="Compiler">
      <CompilerSelect v-model="variable.compiler" @change="handleChange"/>
    </el-form-item>
    <el-form-item label="Remark">
      <el-input v-model="variable.remark" type="textarea" :rows="3" @input="handleChange"/>
    </el-form-item>
  </el-form>
</template>

<script>
import InputTypeSelect from "../../../common/InputTypeSelect.vue";
import CompilerSelect from "../../../common/CompilerSelect.vue";
import VariableInput from "../../installer/VariableInput.vue";

export default {
  name: "VariableSettingForm",
  components: {VariableInput, CompilerSelect, InputTypeSelect},
  props: {
    variable: {
      required: true
    },
    // 是否为组变量
    withGroup: {
      default: false
    }
  },
  methods: {
    handleChange () {
      this.$emit('change')
    },
    // 添加选项
    createOption () {
      this.variable.options.push({
        value: '',
        label: '',
        remark: ''
      })
    },
    // 删除选项
    deleteOption (index) {
      this.variable.options.splice(index, 1)
    }
  }
}
</script>

<style scoped>

</style>