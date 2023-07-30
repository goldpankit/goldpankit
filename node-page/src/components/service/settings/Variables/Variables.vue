<template>
  <div class="tree">
    <div class="variables-wrap">
      <div class="tools">
        <el-button icon="Plus" type="primary" @click="createVariable()">Add Variable</el-button>
        <el-button icon="Plus" type="primary" @click="createGroup(null, 'service')">Add Group</el-button>
      </div>
      <el-tree
        ref="tree"
        class="variables"
        :expand-on-click-node="false"
        :default-expand-all="true"
        :data="variables"
        node-key="name"
        @node-click="selectVariable"
        draggable
        :allow-drop="allowDrop"
        :allow-drag="allowDrag"
        empty-text="No Variables"
        @node-drag-start="handleDragStart"
        @node-drop="handleDrop"
      >
        <template #default="{ node, data }">
          <div class="title">
            <span>{{data.label}}</span>
            <div
              v-if="data.type === 'group' || data.inputType === 'query_model' || data.inputType === 'table'"
              class="opera"
            >
              <el-button
                class="button-icon"
                icon="Plus"
                size="small"
                @click.stop="createChild(data)"
              ></el-button>
            </div>
          </div>
        </template>
      </el-tree>
    </div>
    <div class="variable-setting">
      <div class="title">
        <h4>Variable Setting</h4>
        <el-button v-if="currentVariable != null" type="danger" text @click="deleteVariable">Delete</el-button>
      </div>
      <div class="content-wrap">
        <template v-if="currentVariable != null">
          <VariableSettingForm
            v-if="currentVariable.type === 'variable'"
            :variable="currentVariable"
            :variables="variables"
            :with-group="currentGroup != null"
            @change="saveVariables"
          />
          <VariableGroupSettingForm
            v-if="currentVariable.type === 'group'"
            :variable="currentVariable"
            @change="saveVariables"
          />
        </template>
        <template v-else>
          <div class="variable-holder">
            <h4>Variable & Variable Group Settings</h4>
            <p>You can open Settings by clicking on variables or groups of variables on the left.</p>
          </div>
        </template>
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
import VariableGroupSettingForm from "./VariableGroupSettingForm.vue";
import {fetchConfig, saveVariables} from "../../../../api/service";
import {generateId} from "../../../../utils/generator";

export default {
  name: "Variables",
  components: {
    VariableGroupSettingForm, VariableSettingForm, VariableInput, I18nInput, InputTypeSelect, CompilerSelect},
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
      currentGroup: null,
      variables: [],
      dragData: {
        target: null
      }
    }
  },
  methods: {
    // 选择变量
    selectVariable(variable, node) {
      this.currentVariable = null
      this.$nextTick(() => {
        this.currentVariable = variable
        this.currentGroup = null
        if (node.level > 1) {
          this.currentGroup = node.parent.data
        }
      })
    },
    // 添加子节点
    createChild (variable) {
      // 为组添加子变量
      if (variable.type === 'group') {
        this.createVariable(variable)
        return
      }
      // 为查询模型添加模型字段作用域变量
      if (variable.inputType === 'query_model') {
        this.createGroup(variable,'query_model_field')
        return
      }
      // 为表添加表字段作用域变量
      if (variable.inputType === 'table') {
        this.createGroup(variable,'table_field')
      }
    },
    // 添加变量
    createVariable (group) {
      const varName = this.__generateVariableName(group == null ? this.variables : group.children)
      const newVar = {
        id: generateId(),
        type: 'variable',
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
        if (this.variables.length === 0) {
          this.variables.push(newVar)
        } else {
          const lastVarIndex = this.variables.findLastIndex(v => v.type === 'variable')
          if (lastVarIndex === -1) {
            this.variables.unshift(newVar)
          } else {
            this.variables.splice(lastVarIndex + 1, 0, newVar)
          }
        }
      }
      this.currentVariable = newVar
      this.$refs.tree.setCurrentKey(this.currentVariable.name)
      this.saveVariables()
    },
    // 添加变量组
    createGroup (variable) {
      const groupName = this.__generateGroupName()
      const newGroup = {
        id: generateId(),
        type: 'group',
        name: groupName,
        label: groupName,
        children: []
      }
      if (variable == null) {
        this.variables.push(newGroup)
      } else {
        if (variable.children == null) {
          variable.children = []
        }
        variable.children.push(newGroup)
        console.log('variable', variable)
      }
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
            return copyItem
          }
          // 模型变量 || 表变量
          if (item.inputType === 'query_model' || item.inputType === 'table') {
            const copyItem = JSON.parse(JSON.stringify(item))
            copyItem.children && copyItem.children.forEach(group => {
              group.children.map(v => {
                return this.__getSaveVariable(v)
              })
            })
            // 删除选项列表
            delete copyItem.options
            return copyItem
          }
          // select类型
          if (item.inputType === 'select') {
            const copyItem = JSON.parse(JSON.stringify(item))
            const setting = {}
            const targetOption = copyItem.options.find(opt => opt.value === copyItem.defaultValue.value)
            if (targetOption != null) {
              for (const sett of targetOption.settings) {
                console.log('sett', sett)
                setting[sett.name] = sett.value
              }
            }
            console.log('value settings', setting)
            copyItem.defaultValue.settings = setting
            // 过滤掉无效的选项
            copyItem.options = copyItem.options.filter(
              opt => opt.value.trim().length > 0 && opt.label.trim().length > 0
            )
            return copyItem
          }
          // 变量
          return this.__getSaveVariable(item)
        })
      })
        .then(data => {
          console.log('data', data)
        })
        .catch(e => {
          this.$tip.apiFailed(e)
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
          this.variables = this.variables.sort((item1, item2) => {
            if (item1.type === 'variable' && item2.type === 'group') {
              return -1
            }
            return 1
          })
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 删除变量
    deleteVariable () {
      const type = this.currentVariable.type === 'variable' ? 'variable' : 'variable group'
      this.$model.deleteConfirm(`Do you want to delete the ${type} named 「${this.currentVariable.name}」?`)
        .then(() => {
          if (this.currentGroup != null) {
            const index = this.currentGroup.children.findIndex(v => v.id === this.currentVariable.id)
            if (index === -1) {
              return
            }
            this.currentGroup.children.splice(index, 1)
            this.currentVariable = null
            this.saveVariables()
            return
          }
          const index = this.variables.findIndex(v => v.id === this.currentVariable.id)
          if (index === -1) {
            return
          }
          this.variables.splice(index, 1)
          this.currentVariable = null
          this.saveVariables()
        })
        .catch(() => {})
    },
    handleDragStart (node) {
      this.dragData.target = node.data
    },
    handleDrop () {
      this.saveVariables()
    },
    allowDrag () {
      return true
    },
    allowDrop (draggingNode, dropNode, dropType) {
      // 移动变量
      if (draggingNode.data.type === 'variable') {
        // 不允许移动到其他变量内部
        if (dropNode.data.type === 'variable' && dropType === 'inner') {
          return false
        }
        return true
      }
      // 移动变量组
      if (draggingNode.data.type === 'group') {
        console.log('dropType', dropType)
        // 不允许移动到其他变量或变量组内部
        if (dropNode.data.type === 'variable') {
          return false
        }
        return true
      }
      return false
    },
    // 获取保存变量内容
    __getSaveVariable (variable) {
      // 变量
      const copyVariable = JSON.parse(JSON.stringify(variable))
      // 选项类型过滤掉无效选项
      if (copyVariable.inputType === 'select' || copyVariable.inputType === 'radio' || copyVariable.inputType === 'checkbox'){
        copyVariable.options = copyVariable.options.filter(
          opt => opt.value.trim().length > 0 && opt.label.trim().length > 0
        )
      }
      // 其他非选项类型删掉options
      else {
        delete copyVariable.options
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
      --selected-background-color: #ececea;
      :deep(.el-tree-node) {
        min-height: 30px;
        .el-tree-node__content {
          min-height: 30px;
        }
        &:last-of-type {
          border-bottom: 0;
        }
        &.is-current > .el-tree-node__content {
          background: var(--selected-background-color);
          &:hover {
            background: var(--selected-background-color);
          }
        }
        //&:focus > .el-tree-node__content, &:hover > .el-tree-node__content {
        //  background: var(--selected-background-color);
        //}
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
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      h4 {
        flex-shrink: 0;
        margin-top: 15px;
        padding-bottom: 15px;
      }
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
      // 变量空提示
      .variable-holder {
        font-size: 18px;
        width: 455px;
        margin: 30px auto 0 auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 50px;
        p {
          line-height: 30px;
          color: var(--color-gray);
        }
      }
    }
  }
}
</style>
