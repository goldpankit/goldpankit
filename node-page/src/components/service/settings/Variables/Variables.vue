<template>
  <div class="tree">
    <div class="variables-wrap">
      <div class="tools">
        <el-button icon="Plus" type="primary" @click="createVariable()">{{$t('service.settings.variable.addVariable')}}</el-button>
        <el-button icon="Plus" type="primary" @click="createGroup(null, 'service')">{{$t('service.settings.variable.addGroup')}}</el-button>
      </div>
      <el-tree
        ref="tree"
        class="variables"
        :expand-on-click-node="false"
        :default-expand-all="true"
        :highlight-current="true"
        :data="variables"
        node-key="name"
        @node-click="selectVariable"
        draggable
        :allow-drop="allowDrop"
        :allow-drag="allowDrag"
        :empty-text="$t('service.settings.variable.noVariables')"
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
        <h4>{{$t('service.settings.variable.variableSetting')}}</h4>
        <el-button v-if="currentVariable != null" size="default" type="danger" link @click="deleteVariable">删除变量</el-button>
      </div>
      <div class="content-wrap">
        <template v-if="currentVariable != null">
          <VariableSettingForm
            v-if="currentVariable.type === 'variable'"
            :variable="currentVariable"
            :variable-group="currentGroup"
            :root-variable="currentRootVariable"
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
            <h5>{{$t('service.settings.variable.variableHolderTitle')}}</h5>
            <p>{{$t('service.settings.variable.variableHolderTip')}}</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import CompilerSelect from "@/components/common/CompilerSelect.vue";
import InputTypeSelect from "@/components/common/InputTypeSelect.vue";
import I18nInput from "@/components/common/I18nInput.vue";
import VariableInput from "@/components/service/installer/VariableInput.vue";
import VariableSettingForm from "./VariableSettingForm.vue";
import VariableGroupSettingForm from "./VariableGroupSettingForm.vue";
import {generateId} from "@/utils/generator";
import {
  fetchConfig as fetchServiceConfig,
  saveVariables as saveServiceVariables
} from "@/api/service";
import {
  fetchConfig as fetchPluginConfig,
  saveVariables as savePluginVariables
} from "@/api/plugin";

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
    },
    plugin: {
      required: false
    }
  },
  data() {
    return {
      isWorking: {
        save: false
      },
      timeout: {
        save: null
      },
      varIndex: 1,
      groupIndex: 1,
      currentVariable: null,
      currentGroup: null,
      currentRootVariable: null,
      variables: [],
      dragData: {
        target: null
      }
    }
  },
  computed: {
    // 是否为插件
    isPlugin () {
      return this.plugin != null
    },
    unique () {
      if (this.isPlugin) {
        return {
          space: this.space,
          service: this.service,
          plugin: this.plugin
        }
      }
      return {
        space: this.space,
        service: this.service
      }
    },
    saveVariablesApi () {
      if (this.isPlugin) {
        return savePluginVariables
      }
      return saveServiceVariables
    },
    fetchConfigApi () {
      if (this.isPlugin) {
        return fetchPluginConfig
      }
      return fetchServiceConfig
    }
  },
  methods: {
    // 选择变量
    selectVariable(variable, node) {
      this.currentVariable = null
      this.$nextTick(() => {
        this.currentVariable = variable
        this.currentGroup = null
        this.currentRootVariable = null
        /**
         * 选中字段变量：填充当前根变量和组
         * 当层级大于2时，根变量只可能是查询模型或表变量，此时选中节点的上一级为组，上上级为根变量
         */
        if (node.level > 2) {
          this.currentRootVariable = node.parent.parent.data
          this.currentGroup = node.parent.data
        }
        /**
         * 填充当前根变量和组
         * 根变量为查询模型或表变量时，二级为组，一级为变量。
         * 根变量为组时，二级为变量，一级为组
         * 所以选中第二级时，一级可能是组也可能是变量，此处需要判断上级的类型，为组时才赋值
         * 而根变量一定是上级
         */
        else if (node.level > 1) {
          this.currentRootVariable = node.parent.data
          this.currentGroup = node.parent.data
        }
        /**
         * 填充当前根变量
         * 只有一级时，当前这级为根变量，不存在组
         */
        else {
          this.currentRootVariable = node.data
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
        this.createGroup(variable, [])
        return
      }
      // 为表添加表字段作用域变量
      if (variable.inputType === 'table') {
        this.createGroup(variable, [])
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
        this.variables.push(newVar)
      }
      this.saveVariables()
    },
    // 添加变量组
    createGroup (variable, defaultValue) {
      const groupName = this.__generateGroupName()
      const newGroup = {
        id: generateId(),
        type: 'group',
        name: groupName,
        label: groupName,
        children: [],
        defaultValue
      }
      if (variable == null) {
        this.variables.push(newGroup)
      } else {
        if (variable.children == null) {
          variable.children = []
        }
        variable.children.push(newGroup)
      }
      this.currentVariable = newGroup
      this.saveVariables()
    },
    // 保存变量
    saveVariables () {
      if (this.timeout.save != null) {
        clearTimeout(this.timeout.save)
      }
      this.timeout.save = setTimeout(() => {
        // 请求保存
        this.saveVariablesApi({
          ...this.unique,
          variables: this.getVariables()
        })
          .then(() => {
          })
          .catch(e => {
            this.$tip.apiFailed(e)
          })
          .finally(() => {
            this.timeout.save = null
          })
      }, 300)
    },
    // 获取变量配置
    fetchVariables () {
      this.fetchConfigApi({
        ...this.unique
      })
        .then(data => {
          this.variables = data.variables.map(variable => {
            return this.__getInitVariable(variable)
          })
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 获取最终变量
    getVariables () {
      // 过滤掉无效的变量
      const variables = this.variables.filter(v => v.name.trim().length > 0 && v.label.trim().length > 0)
      // 对变量逐个处理
      return variables.map(item => {
        return this.__getSaveVariable(item)
      })
    },
    // 删除变量
    deleteVariable () {
      const type = this.currentVariable.type === 'variable' ? '变量' : '变量组'
      this.deleteConfirm(`确认删除 ${type} 「${this.currentVariable.label}」？删除后无法恢复！`)
        .then(() => {
          /**
           * 删除字段变量
           * 需要将字段变量组的默认值中的字段变量值给删除
           */
          if (this.currentRootVariable !== this.currentVariable &&
            (
              this.currentRootVariable.inputType === 'query_model' ||
              this.currentRootVariable.inputType === 'table'
            ) &&
            this.currentGroup != null
          ) {
            // 将变量从组中移除
            const index = this.currentGroup.children.findIndex(v => v.id === this.currentVariable.id)
            if (index === -1) {
              return
            }
            this.currentGroup.children.splice(index, 1)
            // 根变量的children为字段变量组
            for (const fieldGroup of this.currentRootVariable.children) {
              for (const field of fieldGroup.defaultValue) {
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
            this.currentVariable = null
            this.saveVariables()
            return
          }
          // 删除组内变量
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
          // 删除组或删除根变量
          const index = this.variables.findIndex(v => v.id === this.currentVariable.id)
          if (index === -1) {
            return
          }
          this.variables.splice(index, 1)
          this.currentVariable = null
          this.saveVariables()
        })
        .catch(e => {
          if (e !== 'cancel') {
            throw new Error(e)
          }
        })
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
        // 不允许移动到其他变量或变量组内部
        if (dropNode.data.type === 'variable') {
          return false
        }
        return true
      }
      return false
    },
    // 获取有效的option
    __getValidOptions (options) {
      return options.filter(
        opt => opt.value.trim().length > 0 && opt.label.trim().length > 0
      )
    },
    // 获取初始变量内容
    __getInitVariable (variable) {
      const copyVariable = JSON.parse(JSON.stringify(variable))
      // 变量组增加children，防止用户自行修改
      if (copyVariable.type === 'group') {
        copyVariable.children = copyVariable.children == null ? [] : copyVariable.children.map(v => {
          // 无论是可选变量还是输入变量，都增加options，在保存时会根据类型自动过滤该属性
          v.options = v.options == null ? [] : v.options
          return this.__getInitVariable(v)
        })
        return copyVariable
      }
      // 无论是可选变量还是输入变量，都增加options，在保存时会根据类型自动过滤该属性
      copyVariable.options = copyVariable.options == null ? [] : copyVariable.options
      // 无论是否为select，都为每个options增加settings
      copyVariable.options.forEach(opt => {
        opt.settings = opt.settings == null ? [] : opt.settings
      })
      /**
       * select处理
       * select在配置文件中的存储结构为defaultValue: { value: null, settings: {} }，
       * 其中选项配置的值放在了settings中，结构为settings: { a: 1, b: 2 }，其中ab表示选项配置的name
       * 此处处理为初始化选项的配置项value字段，该字段为正式填写时的值字段
       */
      if (copyVariable.inputType === 'select') {
        if (JSON.stringify(copyVariable.defaultValue.settings) === '{}') {
          return copyVariable
        }
        copyVariable.options.forEach(option => {
          option.settings = option.settings.map(sett => {
            return {
              ...sett,
              value: copyVariable.defaultValue.settings[sett.name]
            }
          })
        })
        return copyVariable
      }
      return copyVariable
    },
    // 获取保存变量内容
    __getSaveVariable (variable) {
      const copyVariable = JSON.parse(JSON.stringify(variable))
      // 变量组
      if (copyVariable.type === 'group') {
        copyVariable.children = copyVariable.children.map(v => {
          return this.__getSaveVariable(v)
        })
        return copyVariable
      }
      /**
       * 数字输入
       * 需要将值转为整数
       */
      if (copyVariable.inputType === 'number_input') {
        copyVariable.defaultValue = parseInt(copyVariable.defaultValue)
        return copyVariable
      }
      /**
       * 模型变量 & 表变量处理
       * 模型变量和表变量都存在子变量，这些子变量均为变量组。针对字段的变量与普通变量就只是在输入类型上有区别而已了。
       * 所以，此处需要将字段变量进行处理，处理内容如下
       * 1. 递归处理字段变量，即copyVariable.children.children
       * 2. 删除copyVariable的options字段
       */
      if (copyVariable.inputType === 'query_model' || copyVariable.inputType === 'table') {
        // 1. 递归处理字段变量，即copyVariable.children.children
        if (copyVariable.children != null && copyVariable.children.length > 0) {
          copyVariable.children = copyVariable.children.map(group => {
            group.children = group.children.map(selectedField => {
              return {
                ...this.__getSaveVariable(selectedField),
                // 清理不必要字段，其它字段均有可能作为变量存在
                origin: undefined,
                // 查询模型时，模型中的field会有table字段
                table: undefined
              }
            })
            return group
          })
        }
        // 2. 删除copyVariable的options字段
        delete copyVariable.options
        return copyVariable
      }
      /**
       * select类型处理
       * select类型的变量有options字段，option中有settings字段。需要干一下事情来处理
       * 1. 过滤掉无效的option
       * 2. 过滤掉option中无效的setting
       * 3. settings中的每一项选项配置都存在value字段，用于存储正式用户填充的配置值，当此处作为选项存储，无需存储value字段，所以在此需要进行删除
       */
      if (copyVariable.inputType === 'select') {
        // 1. 过滤掉无效的option
        copyVariable.options = this.__getValidOptions(copyVariable.options)
        // 2. 过滤掉option中无效的setting
        copyVariable.options.forEach(option => {
          option.settings = option.settings.filter(sett => sett.name.trim() !== '' && sett.label.trim() !== '')
        })
        // 3. settings中的每一项选项配置都存在value字段，用于存储正式用户填充的配置值，但此处作为选项存储，无需存储value字段，所以在此需要进行删除
        copyVariable.options.forEach(option => {
          option.settings.forEach(sett => {
            delete sett.value
          })
        })
        return copyVariable
      }
      /**
       * checkbox和radio类型处理
       * select类型的变量有options字段，option中有settings字段。需要干一下事情来处理
       * 1. 将options中的无效项去掉
       * 2. 去掉option中的settings字段，checkbox和radio是不支持选项设置的
       */
      if (copyVariable.inputType === 'radio' || copyVariable.inputType === 'checkbox') {
        // 1. 将options中的无效项去掉
        copyVariable.options = this.__getValidOptions(copyVariable.options)
        // 2. 去掉option中的settings字段，checkbox和radio是不支持选项设置的
        copyVariable.options.forEach(option => {
          delete option.settings
        })
        return copyVariable
      }
      /**
       * 其他变量（剩下未处理的变量为input，textarea，database）
       * 在获取变量时，无论是否需要存在options都添加上了，所以此处需要删除
       */
      delete copyVariable.options
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
    display: flex;
    flex-direction: column;
    .tools {
      flex-shrink: 0;
      display: flex;
      padding-bottom: 10px;
    }
    // 变量列表
    .variables {
      --selected-background-color: #ececea;
      flex-grow: 1;
      overflow-y: auto;
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
        width: 500px;
        margin: 30px auto 0 auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding-top: 100px;
        h5 {
          font-size: var(--font-size-large);
          margin-bottom: 20px;
        }
        p {
          line-height: 30px;
          color: var(--color-gray);
          font-size: var(--font-size-middle);
        }
      }
    }
  }
}
</style>
