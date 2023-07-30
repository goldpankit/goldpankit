<template>
  <el-form :model="variable">
<!--    <el-form-item v-if="!withGroup" label="Scope" required>-->
<!--      <el-radio-group v-model="variable.scope" @change="handleChange">-->
<!--        <el-radio label="service" border>Service</el-radio>-->
<!--        <el-radio label="table_field" border>Table Field</el-radio>-->
<!--        <el-radio label="query_model_field" border>Query Model Field</el-radio>-->
<!--      </el-radio-group>-->
<!--    </el-form-item>-->
    <el-form-item label="Label" required>
      <el-input v-model="variable.label" @input="handleChange"/>
    </el-form-item>
    <el-form-item label="Name" required>
      <el-input v-model="variable.name" @input="handleChange"/>
    </el-form-item>
    <el-form-item label="Input Type" required>
      <InputTypeSelect
        v-model="variable.inputType"
        :with-group="withGroup"
        @change="handleInputTypeChange"
      />
    </el-form-item>
    <el-form-item
      v-if="variable.inputType === 'select' || variable.inputType === 'checkbox' || variable.inputType === 'radio'"
      label="Options"
      class="item-options"
      required
    >
      <template #label>
        <div>
          <label>Options</label>
          <div class="opera">
            <el-button type="primary" @click="createOption">Add</el-button>
          </div>
        </div>
      </template>
      <el-table
        :data="variable.options"
        v-sortable:config="{
          data: variable.options,
          onChange: handleOptionSorted
        }"
      >
        <el-table-column width="25px">
          <SortableButton/>
        </el-table-column>
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
        <el-table-column
          v-if="variable.options.length > 0"
          :min-width="variable.inputType === 'select' ? '120px' : '60px'"
          fixed="right"
        >
          <template #default="{ row, $index }">
            <el-button v-if="variable.inputType === 'select'" icon="Setting" class="button-icon" @click="$refs.optionSettingWindow.open(row)"></el-button>
            <el-button icon="Delete" class="button-icon" @click="deleteOption($index)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 选项设置 -->
      <OptionSettingWindow ref="optionSettingWindow" @change="handleChange"/>
    </el-form-item>
    <el-form-item label="Default Value">
      <VariableInput
        :variable="variable"
        :variables="variables"
        value-key="defaultValue"
        @change="handleChange"
      />
    </el-form-item>
    <el-form-item label="Required">
      <el-switch v-model="variable.required" @change="handleChange"/>
    </el-form-item>
    <el-form-item label="Hidden">
      <el-switch v-model="variable.hidden" @change="handleChange"/>
    </el-form-item>
    <el-form-item
      v-if="variable.inputType !== 'table' && variable.inputType !== 'query_model' && variable.inputType !== 'database'"
      label="Compiler"
    >
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
import SortableButton from "../../../common/SortableButton.vue";
import OptionSettingWindow from "./OptionSettingWindow.vue";

export default {
  name: "VariableSettingForm",
  components: {OptionSettingWindow, SortableButton, VariableInput, CompilerSelect, InputTypeSelect},
  props: {
    // 当前设置的变量
    variable: {
      required: true
    },
    // 所有变量
    variables: {
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
        remark: '',
        settings: []
      })
    },
    // 删除选项
    deleteOption (index) {
      console.log('index', index)
      this.variable.options.splice(index, 1)
    },
    // 处理输入类型变更
    handleInputTypeChange () {
      // select的值为{value: '', settings: []}
      let value = this.variable.defaultValue
      if (value != null && value.value != null) {
        value = value.value
      }
      // 如果切换到checkbox，则值调整为数组
      if (this.variable.inputType === 'checkbox') {
        this.variable.defaultValue = [value]
      }
      // 如果切换到number_input，则值调整为整数
      else if (this.variable.inputType === 'number_input') {
        let newValue = Number(parseInt(value instanceof Array ? value[0] : value))
        if (isNaN(newValue)) {
          newValue = 0
        }
        this.variable.defaultValue = newValue
      }
      // 如果切换到select，则需填充settings，值调整为{value: '', settings: []}格式
      else if (this.variable.inputType === 'select') {
        const currentOption = this.variable.options.find(opt => opt.value === value)
        this.variable.defaultValue = {
          value,
          settings: currentOption == null ? [] : currentOption.settings
        }
      }
      // 其他值调整为字符串
      else {
        this.variable.defaultValue = value instanceof Array ? value[0] : value
      }
      this.handleChange()
    },
    // 处理选项排序
    handleOptionSorted (newOptions) {
      this.variable.options = []
      this.$nextTick(() => {
        this.variable.options = newOptions
        this.handleChange()
      })
    }
  }
}
</script>

<style scoped>

</style>
