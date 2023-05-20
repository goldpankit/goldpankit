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
            <el-input v-model="currentVariable.name"/>
          </el-form-item>
          <el-form-item label="Message" required>
            <I18nInput v-model="currentVariable.message"/>
          </el-form-item>
          <el-form-item label="Compiler" required>
            <CompilerSelect v-model="currentVariable.compiler"/>
          </el-form-item>
          <el-form-item label="Input Type" required>
            <InputTypeSelect v-model="currentVariable.inputType"/>
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
            <el-table :data="currentVariable.values">
              <el-table-column label="*Name" min-width="120px">
                <template #default="{ row }">
                  <el-input v-model="row.name"/>
                </template>
              </el-table-column>
              <el-table-column label="*Label" min-width="200px">
                <template #default="{ row }">
                  <el-input v-model="row.label" type="textarea" :rows="1"/>
                </template>
              </el-table-column>
              <el-table-column label="*Compiler" min-width="120px">
                <template #default="{ row }">
                  <CompilerSelect v-model="row.compiler"/>
                </template>
              </el-table-column>
              <el-table-column label="Remark" min-width="140px">
                <template #default="{ row }">
                  <el-input v-model="row.remark" type="textarea" :rows="1"/>
                </template>
              </el-table-column>
              <el-table-column v-if="currentVariable.values.length > 0" min-width="60px" fixed="right">
                <template #default="{ row, index }">
                  <el-button icon="Delete" class="button-icon"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="Remark">
            <el-input v-model="currentVariable.remark" type="textarea" :rows="3"/>
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

export default {
  name: "SettingVariables",
  components: {I18nInput, InputTypeSelect, CompilerSelect},
  props: {
    serviceId: {
      required: true
    }
  },
  data() {
    return {
      varIndex: 1,
      currentVariable: null,
      variables: [
        {
          name: 'basePackage',
          message: '包名',
          inputType: 'input',
          compiler: 'static',
          remark: '',
          editable: false,
          values: [
            {name: 'Hash'},
            {name: 'History'},
          ]
        },
        {
          name: 'routeType',
          message: '路由方式',
          inputType: 'checkbox',
          compiler: 'static',
          remark: '',
          editable: false,
          values: [
            {name: 'hash', label: 'Hash'},
            {name: 'history', label: 'History'},
          ]
        }
      ]
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
        compiler: 'static',
        remark: '',
        values: []
      }
      this.variables.push(newVar)
      this.currentVariable = newVar
    },
    // 添加选项
    createOption () {
      this.currentVariable.options.push({
        name: '',
        label: '',
        compiler: 'static',
        remark: ''
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
    padding-right: 20px;
    .tools {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 5px;
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
      margin-top: 5px;
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
