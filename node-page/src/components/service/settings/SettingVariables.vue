<template>
  <div class="tree">
    <div class="variables-wrap">
      <div class="tools">
        <el-button icon="Plus" type="primary" @click="createVariable">Add</el-button>
      </div>
      <ul class="variables">
        <li
          v-for="variable in variables"
          :key="variable.name"
          :class="{ selected: currentVariable != null && currentVariable.name === variable.name }"
          @click="selectVariable(variable)"
        >
          <div class="title">
            <span>{{variable.message}}</span>
            <em :class="`type-${variable.inputType}`">{{__getInputTypeLabel(variable.inputType)}}</em>
          </div>
          <div class="content">Hello</div>
        </li>
      </ul>
    </div>
    <div class="variable-setting">
      <h4>Variable Setting</h4>
      <div class="content-wrap">
        <el-form v-if="currentVariable != null">
          <el-form-item label="Name" required>
            <el-input v-model="currentVariable.name" @input="saveVariables"/>
          </el-form-item>
          <el-form-item label="Message" required>
            <I18nInput v-model="currentVariable.message" @input="saveVariables"/>
          </el-form-item>
          <el-form-item label="Input Type" required>
            <InputTypeSelect v-model="currentVariable.inputType" @change="saveVariables"/>
          </el-form-item>
          <el-form-item
            v-if="currentVariable.inputType === 'checkbox' || currentVariable.inputType === 'radio'"
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
            <el-table :data="currentVariable.options">
              <el-table-column label="*Value" min-width="120px">
                <template #default="{ row }">
                  <el-input v-model="row.value" @input="saveVariables"/>
                </template>
              </el-table-column>
              <el-table-column label="*Label" min-width="200px">
                <template #default="{ row }">
                  <el-input v-model="row.label" type="textarea" :rows="1" @input="saveVariables"/>
                </template>
              </el-table-column>
              <el-table-column label="Remark" min-width="150px">
                <template #default="{ row }">
                  <el-input v-model="row.remark" type="textarea" :rows="1" @input="saveVariables"/>
                </template>
              </el-table-column>
              <el-table-column v-if="currentVariable.options.length > 0" min-width="60px" fixed="right">
                <template #default="{ row, index }">
                  <el-button icon="Delete" class="button-icon" @click="deleteOption(index)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="Default Value">
            <VariableInput :variable="currentVariable" value-key="defaultValue" @change="saveVariables"/>
          </el-form-item>
          <el-form-item label="Required">
            <el-switch v-model="currentVariable.required" @change="saveVariables"/>
          </el-form-item>
          <el-form-item label="Compiler">
            <CompilerSelect v-model="currentVariable.compiler" @change="saveVariables"/>
          </el-form-item>
          <el-form-item label="Remark">
            <el-input v-model="currentVariable.remark" type="textarea" :rows="3" @input="saveVariables"/>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import CompilerSelect from "../../common/CompilerSelect.vue";
import InputTypeSelect from "../../common/InputTypeSelect.vue";
import I18nInput from "../../common/I18nInput.vue";
import {fetchConfig, saveVariables} from "../../../api/service";
import VariableInput from "../installer/VariableInput.vue";

export default {
  name: "SettingVariables",
  components: {VariableInput, I18nInput, InputTypeSelect, CompilerSelect},
  props: {
    space: {
      required: true
    },
    service: {
      required: true
    }
  },
  data() {
    return {
      varIndex: 1,
      currentVariable: null,
      variables: []
    }
  },
  methods: {
    // 选择变量
    selectVariable(variable) {
      this.currentVariable = variable
    },
    // 添加变量
    createVariable () {
      const varName = this.__generateVariableName()
      const newVar = {
        name: varName,
        message: varName,
        inputType: 'input',
        required: false,
        defaultValue: '',
        compiler: 'static',
        remark: '',
        options: []
      }
      this.variables.push(newVar)
      this.currentVariable = newVar
      this.saveVariables()
    },
    // 添加选项
    createOption () {
      this.currentVariable.options.push({
        value: '',
        label: '',
        remark: ''
      })
    },
    // 删除选项
    deleteOption (index) {
      this.currentVariable.options.splice(index, 1)
    },
    // 保存变量
    saveVariables () {
      // 过滤掉无效的变量
      const variables = this.variables.filter(v => v.name.trim().length > 0 && v.message.trim().length > 0)
      // 请求保存
      saveVariables({
        space: this.space,
        service: this.service,
        variables: variables.map(item => {
          const copyItem = JSON.parse(JSON.stringify(item))
          // 输入类型去掉选项
          if (copyItem.inputType === 'input') {
            delete copyItem.options
          }
          // 选项类型过滤掉无效选项
          else {
            copyItem.options = copyItem.options.filter(
              opt => opt.value.trim().length > 0 && opt.label.trim().length > 0
            )
          }
          return copyItem
        })
      })
        .then(data => {
          console.log('data', data)
        })
        .catch(e => {
          console.log('e', e)
        })
    },
    // 获取变量配置
    fetchVariables () {
      fetchConfig({
        space: this.space,
        service: this.service
      })
        .then(data => {
          this.variables = data.variables.map(item => {
            return {
              ...item,
              // 无论是可选变量还是输入变量，都增加options，在保存时会根据类型自动过滤该属性
              options: item.options == null ? [] : item.options
            }
          })
        })
        .catch(e => {
          console.log('e', e)
        })
    },
    __generateVariableName () {
      let varName
      while(true) {
        varName = `var${this.varIndex}`
        this.varIndex ++
        if (this.variables.findIndex(v => v.name === varName) === -1) {
          return varName
        }
      }
    },
    __getInputTypeLabel(inputType) {
      const inputTypes = {
        input: 'Input',
        radio: 'Radio',
        checkbox: 'Checkbox',
        textarea: 'Textarea',
      }
      return inputTypes[inputType]
    }
  },
  created() {
    this.fetchVariables()
  }
}
</script>

<style scoped lang="scss">
.tree {
  height: 100%;
  display: flex;
  .variables-wrap {
    width: 280px;
    flex-shrink: 0;
    border-right: 1px solid var(--border-default-color);
    padding-top: 10px;
    .tools {
      display: flex;
      justify-content: flex-end;
      padding-bottom: 10px;
      padding-right: 10px;
    }
    // 变量列表
    ul.variables {
      & > li {
        border-top: 1px solid var(--border-default-color);
        cursor: pointer;
        &.selected {
          .title span {
            color: var(--primary-color-match-2);
            font-weight: bold;
          }
        }
        .title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          span {
            flex-grow: 1;
            word-break: break-all;
          }
          em {
            flex-shrink: 0;
            font-style: normal;
            margin-right: 5px;
            font-size: var(--font-size-mini);
            color: var(--color-gray-1);
            border-radius: 5px;
            font-weight: bold;
          }
        }
        .content {
          height: 0;
          overflow: hidden;
        }
      }
    }
  }

  // 设置区域
  .variable-setting {
    flex-grow: 1;
    background: var(--color-light);
    padding: 0 0 0 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    h4 {
      flex-shrink: 0;
      margin-top: 15px;
      padding-bottom: 15px;
    }
    .content-wrap {
      flex-grow: 1;
      overflow-y: auto;
      padding-right: 20px;
      :deep(.item-options) {
        .el-form-item__label {
          padding-right: 0;
          height: 35px;
          margin-bottom: 10px;
          & > div {
            width: 100%;
            display: flex;
            justify-content: space-between;
          }
        }
      }
    }
  }
}
</style>
