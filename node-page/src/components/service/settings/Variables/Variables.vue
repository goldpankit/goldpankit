<template>
  <div class="tree">
    <div class="variables-wrap">
      <div class="tools">
        <el-button icon="Plus" type="primary" @click="createVariable()">Add Variable</el-button>
        <el-button icon="Plus" type="primary" @click="createGroup">Add Group</el-button>
      </div>
      <el-tree
        class="variables"
        :expand-on-click-node="false"
        :default-expand-all="true"
        :data="variables"
        @node-click="selectVariable"
      >
        <template #default="{ node, data }">
          <div class="title">
            <span>{{data.label}}</span>
            <div
              v-if="data.type === 'group'"
              class="opera"
            >
              <el-button
                class="button-icon"
                icon="Plus"
                size="small"
                @click.stop="createVariable(data)"
              ></el-button>
            </div>
          </div>
        </template>
      </el-tree>
    </div>
    <div class="variable-setting">
      <h4>Variable Setting</h4>
      <div class="content-wrap">
        <VariableSettingForm
          v-if="currentVariable != null && currentVariable.type === 'variable'"
          :variable="currentVariable"
          :variables="variables"
          :with-group="isGroupVariable"
          @change="saveVariables"
        />
        <VariableGroupSettingForm
          v-if="currentVariable != null && currentVariable.type === 'group'"
          :variable="currentVariable"
          @change="saveVariables"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CompilerSelect from "../../../common/CompilerSelect.vue";
import InputTypeSelect from "../../../common/InputTypeSelect.vue";
import I18nInput from "../../../common/I18nInput.vue";
import VariableInput from "../../installer/VariableInput.vue";
import VariableSettingForm from "./VariableSettingForm.vue";
import {fetchConfig, saveVariables} from "../../../../api/service";
import VariableGroupSettingForm from "./VariableGroupSettingForm.vue";

export default {
  name: "Variables",
  components: {VariableGroupSettingForm, VariableSettingForm, VariableInput, I18nInput, InputTypeSelect, CompilerSelect},
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
      groupIndex: 1,
      currentVariable: null,
      isGroupVariable: false,
      variables: []
    }
  },
  methods: {
    // 选择变量
    selectVariable(variable, node) {
      this.currentVariable = variable
      this.isGroupVariable = node.level > 1
    },
    // 添加变量
    createVariable (group) {
      const varName = this.__generateVariableName(group == null ? this.variables : group.children)
      const newVar = {
        type: 'variable',
        scope: group == null ? 'service' : group.scope,
        name: varName,
        label: varName,
        inputType: 'input',
        required: false,
        hidden: false,
        defaultValue: '',
        compiler: 'static',
        remark: '',
        options: []
      }
      if (group != null) {
        group.children.push(newVar)
      } else {
        this.variables.push(newVar)
      }
      this.currentVariable = newVar
      this.saveVariables()
    },
    // 添加变量组
    createGroup () {
      const groupName = this.__generateGroupName()
      const newGroup = {
        type: 'group',
        scope: 'service',
        name: groupName,
        label: groupName,
        children: []
      }
      this.variables.push(newGroup)
      this.currentVariable = newGroup
      this.saveVariables()
    },
    // 保存变量
    saveVariables () {
      // 过滤掉无效的变量
      const variables = this.variables.filter(v => v.name.trim().length > 0 && v.label.trim().length > 0)
      // 请求保存
      saveVariables({
        space: this.space,
        service: this.service,
        variables: variables.map(item => {
          // 变量组
          if (item.type === 'group') {
            const copyItem = JSON.parse(JSON.stringify(item))
            copyItem.children = copyItem.children.map(v => {
              return this.__getSaveVariable(v)
            })
            return item
          }
          // 变量
          return this.__getSaveVariable(item)
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
            const variable = JSON.parse(JSON.stringify(item))
            // 变量组增加children，防止用户自行修改
            if (variable.type === 'group') {
              variable.children = variable.children == null ? [] : variable.children.map(v => {
                // 无论是可选变量还是输入变量，都增加options，在保存时会根据类型自动过滤该属性
                v.options = v.options == null ? [] : v.options
                return v
              })
              return variable
            }
            // 无论是可选变量还是输入变量，都增加options，在保存时会根据类型自动过滤该属性
            variable.options = variable.options == null ? [] : variable.options
            return variable
          })
        })
        .catch(e => {
          console.log('e', e)
        })
    },
    // 获取保存变量内容
    __getSaveVariable (variable) {
      // 变量
      const copyVariable = JSON.parse(JSON.stringify(variable))
      // 输入类型去掉选项
      if (copyVariable.inputType === 'input') {
        delete copyVariable.options
      }
      // 选项类型过滤掉无效选项
      else {
        copyVariable.options = copyVariable.options.filter(
          opt => opt.value.trim().length > 0 && opt.label.trim().length > 0
        )
      }
      return copyVariable
    },
    // 生成变量名
    __generateVariableName (scope) {
      let varName
      while(true) {
        varName = `var${this.varIndex}`
        this.varIndex ++
        if (scope.findIndex(v => v.type === 'variable' &&  v.name === varName) === -1) {
          return varName
        }
      }
    },
    // 生成组名
    __generateGroupName () {
      let groupName
      while(true) {
        groupName = `group${this.groupIndex}`
        this.groupIndex ++
        if (this.variables.findIndex(v => v.type === 'group' && v.name === groupName) === -1) {
          return groupName
        }
      }
    },
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
      padding-bottom: 10px;
    }
    // 变量列表
    .variables {
      :deep(.el-tree-node) {
        min-height: 30px;
        .el-tree-node__content {
          min-height: 30px;
        }
        &:last-of-type {
          border-bottom: 0;
        }
      }
      :deep(.title) {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        span {
          flex-grow: 1;
          word-break: break-all;
        }
        .opera {
          padding-right: 10px;
        }
      }
      .content {
        height: 0;
        overflow: hidden;
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
