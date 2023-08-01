<template>
  <el-form :model="variable">
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
        value-key="defaultValue"
        @change="handleDefaultValueChange"
      />
    </el-form-item>
    <el-form-item label="Required">
      <el-switch v-model="variable.required" @change="handleChange"/>
    </el-form-item>
    <el-form-item label="Hidden">
      <el-switch v-model="variable.hidden" @change="handleChange"/>
    </el-form-item>
    <el-form-item
      v-if="variable.inputType !== 'number_input' &&
        variable.inputType !== 'table' &&
        variable.inputType !== 'query_model' &&
        variable.inputType !== 'database' &&
        rootVariable.inputType !== 'query_model' &&
        rootVariable.inputType !== 'table'
      "
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
    // 根变量
    rootVariable: {
      required: true
    },
    // 组变量
    variableGroup: {
      default: false
    }
  },
  computed: {
    withGroup () {
      return this.variableGroup != null
    }
  },
  watch: {
    /**
     * 改变默认值有两种情况
     * 1. 主动修改默认值
     * 2. 调整输入类型
     * 此处是处理第二种情况，当输入类型调整后，会触发change事件来修改输入类型，但默认值改变后，可能需要调整字段变量的值。
     * 在字段变量的值发生变化后，还需要触发一次change事件来保存字段的值，此处触发一次默认值变更事件来完成该事项。
     */
    'variable.defaultValue': function () {
      this.handleFieldVariableValues()
      this.handleChange()
    },
    'variable.name': function () {
      this.handleFieldVariableValues()
      this.handleChange()
    }
  },
  methods: {
    handleChange () {
      this.$emit('change')
    },
    // 处理默认值变更
    handleDefaultValueChange () {
      this.handleFieldVariableValues()
      this.$emit('change')
    },
    /**
     * 处理字段变量值
     * 当根节点为查询模型变量或表变量时，当前变量则为字段变量，当字段变量的name或值发生变化时，需要将根变量下的组变量的默认值更新。
     * e.g 查询模型变量下划分了条件组和列表组，条件组下有字段变量“输入类型-inputType”，当前修改“输入类型”的默认值时，
     * 那么条件组下的字段应及时补充inputType的值为新的默认值，该方法专门处理此项内容
     */
    handleFieldVariableValues () {
      // 选中根变量时不做处理
      if (this.rootVariable === this.variable) {
        return
      }
      if (this.rootVariable.inputType === 'query_model' || this.rootVariable.inputType === 'table') {
        // 根变量的children为字段变量组
        for (const fieldGroup of this.rootVariable.children) {
          // 循环修改所有已选中的字段的当前变量值
          for (const field of fieldGroup.defaultValue) {
            field[this.variable.name] = this.variable.defaultValue
            // 将不存在的变量的值删除
            for (const fieldName in field) {
              // 字段中的origin为原始字段内容，该字段为特殊字段，不做处理
              if (fieldName === 'origin') {
                continue
              }
              const fieldVariable = fieldGroup.children.find(variable => variable.name === fieldName)
              // 找不到字段变量的定义，又在不存在于原始字段信息中，则删除
              if (fieldVariable == null && !field.origin.hasOwnProperty(fieldName)) {
                delete field[fieldName]
              }
            }
          }
        }
      }
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
      // checkbox的值为数组
      if (value instanceof Array) {
        value = value[0]
      }
      // number_input的值为数字，转为字符串
      if (typeof value === 'number') {
        value = value + ''
      }
      // 如果切换到number_input，则值调整为整数
      if (this.variable.inputType === 'number_input') {
        let newValue = Number(parseInt(value))
        if (isNaN(newValue)) {
          newValue = 0
        }
        this.variable.defaultValue = newValue
      }
      // 如果切换到select，则需填充settings，值调整为{value: null, settings: []}格式
      else if (this.variable.inputType === 'select') {
        const currentOption = this.variable.options.find(opt => opt.value === value)
        this.variable.defaultValue = {
          value: currentOption == null ? null : value,
          settings: currentOption == null ? [] : currentOption.settings
        }
      }
      // 如果切换到checkbox，则值调整为数组
      else if (this.variable.inputType === 'checkbox') {
        this.variable.defaultValue = []
      }
      // 如果调整为radio，则值调整为空
      else if (this.variable.inputType === 'radio') {
        this.variable.defaultValue = ''
      }
      // 如果调整为database，query_model或table，值全部改为null
      else if (this.variable.inputType === 'database' || this.variable.inputType === 'table' || this.variable.inputType === 'query_model') {
        this.variable.defaultValue = null
      }
      // 其他值调整为字符串
      else {
        this.variable.defaultValue = value
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
