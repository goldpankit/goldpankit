<template>
  <div class="service-installer">
    <div v-if="withTitle" class="nav">
      <div class="title">
        <h4>@{{space}}/{{service}} · {{$t('service.install2')}} · </h4>
        <el-select v-model="selectedVersion">
          <el-option
            v-for="version in versions"
            :key="version"
            :value="version"
          >{{version}}</el-option>
        </el-select>
      </div>
      <div v-if="withInstallButton" class="install">
        <el-button v-if="userInfo == null" type="important" @click="$router.push({name: 'SignIn'})">登录后可安装服务</el-button>
        <el-button v-else type="important" @click="install" :disabled="isWorking.install">
          {{ isWorking.install ? $t('service.installing') : $t('service.install') }}
        </el-button>
      </div>
    </div>
    <div class="content-wrap" :style="contentWrapStyle">
      <template v-if="withProject || serviceVariables.length > 0">
        <p class="install-tip">{{$t('service.withParametersTip')}}</p>
        <div class="form-wrap">
          <el-form>
            <el-form-item v-if="withProject" :label="$t('project.project')" required class="form-item-project">
              <ProjectSelect
                :model-value="currentProject"
                :with-block="true"
                :with-prefix="false"
                @change="$emit('change-project', $event)"
              />
              <FormItemTip
                v-if="currentProjectDetail != null"
                :content="`服务安装后代码将写入<em>${currentProjectDetail.codespace}</em>目录。`"
              />
            </el-form-item>
            <template v-for="variable in serviceVariables">
              <el-form-item
                v-if="!variable.hidden"
                :key="variable.name"
                :label="variable.label"
                :required="variable.required"
              >
                <template #label>
                  <template v-if="variable.type === 'variable'">{{variable.label}}</template>
                  <template v-else>
                    <div class="label-wrap">
                      <span>{{variable.label}}</span>
                      <el-icon><ArrowRight /></el-icon>
                    </div>
                  </template>
                </template>
                <!-- 根变量 -->
                <VariableInput v-if="variable.type === 'variable'" :variable="variable"/>
                <!-- 服务变量组 -->
                <ul v-else-if="variable.type === 'group'" class="group-vars">
                  <li v-for="v of variable.children" :key="`${variable.name}_${v.name}`">
                    <label class="text-info-1 text-mini"><em v-if="v.required">*</em>{{v.label}}</label>
                    <VariableInput :variable="v"/>
                  </li>
                </ul>
                <!-- 选择的数据源信息 -->
                <FormItemTip
                  v-if="variable.inputType === 'datasource' && currentDatabaseDetail != null"
                  :content="`基础信息：${currentDatabaseDetail.host}:${currentDatabaseDetail.port}/${currentDatabaseDetail.schema}`"
                />
              </el-form-item>
            </template>
          </el-form>
        </div>
      </template>
      <div v-else class="parameters-holder">
        <p>{{$t('service.withoutParametersTip')}}</p>
      </div>
    </div>
    <!-- 代码出错提示窗口 -->
    <ServiceCodeErrorWindow ref="serviceCodeErrorWindow"/>
  </div>
</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import InstallCheckbox from "../service/installer/Checkbox.vue";
import InstallInput from "../service/installer/Input.vue";
import InstallRadio from "../service/installer/Radio.vue";
import VariableInput from "../service/installer/VariableInput.vue";
import MySqlFieldSelect from "../database/MySqlFieldSelect.vue";
import FieldSetting from "../service/installer/FieldSetting.vue";
import DirectorySelect from "../common/DirectorySelect.vue";
import ProjectSelect from "../usr/project/ProjectSelect.vue";
import {install, uninstall} from "../../api/service.compile";
import {fetchVersion} from "../../api/service.version";
import {getDefaultEmptyValue, isEmptyValue} from "../../utils/variable";
import MergeWindow from "../service/installer/merge/MergeWindow.vue";
import ServiceCodeErrorWindow from "../service/ServiceCodeErrorWindow.vue";
import FormItemTip from "../common/FormItemTip.vue";

export default {
  name: "ServiceInstaller",
  components: {
    FormItemTip,
    ServiceCodeErrorWindow,
    MergeWindow,
    ProjectSelect,
    DirectorySelect,
    FieldSetting, MySqlFieldSelect, VariableInput, InstallRadio, InstallInput, InstallCheckbox
  },
  props: {
    installing: {},
    uninstalling: {},
    space: {
      required: true
    },
    service: {
      required: true
    },
    plugin: {
      required: false
    },
    servicePrice: {
      required: true
    },
    serviceLease: {
      required: false
    },
    // 默认选中版本
    version: {
      required: true
    },
    // 可选版本
    versions: {
      required: false,
      default () {
        return []
      }
    },
    // 是否包含项目信息
    withProject: {
      default: true
    },
    // 项目配置信息（项目安装完服务后的配置信息）
    projectConfig: {},
    withTitle: {
      default: false
    },
    withInstallButton: {
      default: false
    }
  },
  data () {
    return {
      isWorking: {
        install: false,
        uninstall: false
      },
      // 安装的版本信息
      versionData: null,
      // 变量
      variables: [],
      // 已选版本
      selectedVersion: null,
    }
  },
  computed: {
    ...mapState(['userInfo', 'currentProject', 'currentProjectDetail', 'currentDatabase', 'currentDatabaseDetail']),
    // 安装的是否为插件
    isPlugin () {
      return this.plugin != null
    },
    // 服务变量集
    serviceVariables () {
      return this.variables
    },
    // content-wrap样式
    contentWrapStyle () {
      if (this.withTitle) {
        return 'border-top: 3px; margin-top: 20px;'
      }
      return 'padding-top: 0; border-top: 0;margin-top: 0;'
    },
    unique () {
      return [this.space, this.service, this.selectedVersion]
    }
  },
  watch: {
    version: {
      immediate: true,
      handler (newValue) {
        this.selectedVersion = newValue
      }
    },
    unique () {
      this.fetchVersion()
    },
    'isWorking.install': function () {
      this.$emit('update:installing', this.isWorking.install)
    },
    'isWorking.uninstall': function () {
      this.$emit('update:uninstalling', this.isWorking.uninstall)
    },
    // 项目配置发生变化后重新初始化变量值
    projectConfig () {
      this.initVariables()
    },
    // 切换了插件后重新初始化变量值
    plugin () {
      this.initVariables()
    }
  },
  methods: {
    ...mapMutations(['setInstallData']),
    ...mapActions(['refreshBalance']),
    // 获取版本信息
    fetchVersion () {
      fetchVersion({
        space: this.space,
        service: this.service,
        plugin: this.plugin,
        version: this.selectedVersion
      })
        .then(data => {
          this.versionData = data
          this.initVariables()
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 安装服务
    install () {
      // 用户已租赁服务，直接安装
      if (this.serviceLease != null) {
        this.__install()
        return
      }
      // 用户未租赁服务 || 按次收费且金额超过伐值，则做金额提醒
      if (this.servicePrice < 50) {
        this.__install()
        return
      }
      // 超过服务金额伐值时做提醒
      this.installConfirm(this.servicePrice)
        .then(() => {
          this.__install()
        })
        .catch(() => {})
    },
    // 初始化变量
    initVariables () {
      if (this.versionData == null) {
        return
      }
      this.variables = JSON.parse(this.versionData.variables).map(item => {
        return this.__initVariableValue(item, null)
      })
    },
    __install () {
      if (this.isWorking.install) {
        return
      }
      this.isWorking.install = true
      // 项目验证
      if (this.currentProject == null || this.currentProject === '') {
        this.$tip.warning(this.$t('service.selectProject'))
        this.isWorking.install = false
        return
      }
      // 变量验证
      const variables = this.__getInstallVariables(this.variables)
      if (!this.__checkVariables(variables)) {
        this.isWorking.install = false
        return
      }
      // 开始安装
      install({
        projectId: this.currentProject,
        database: this.currentDatabase,
        space: this.space,
        service: this.service,
        plugin: this.plugin,
        version: this.selectedVersion,
        variables
      })
        .then(installData => {
          // 此处需要额外补充安装状态，否则无法触发installing属性的更新
          this.isWorking.install = false
          this.$tip.success(this.$t('service.installSuccessfully'))
          this.setInstallData(installData)
          this.refreshBalance()
          this.$emit('installed')
        })
        .catch(e => {
          if (e.code === 6000) {
            this.$refs.serviceCodeErrorWindow.open(e.errorData)
            return
          }
          this.$tip.apiFailed(e)
        })
        .finally(() => {
          this.isWorking.install = false
        })
    },
    // 卸载服务
    uninstall () {
      // 用户已租赁服务，直接卸载
      if (this.serviceLease != null) {
        this.__uninstall()
        return
      }
      // 用户未租赁服务 || 按次收费且金额超过伐值，则做金额提醒
      if (this.servicePrice < 50) {
        this.__uninstall()
        return
      }
      // 超过服务金额伐值时做提醒
      this.uninstallConfirm()
        .then(() => {
          this.__uninstall()
        })
        .catch(() => {})
    },
    __uninstall () {
      if (this.isWorking.uninstall) {
        return
      }
      this.isWorking.uninstall = true
      uninstall({
        projectId: this.currentProject,
        database: this.currentDatabase,
        space: this.space,
        service: this.service,
        plugin: this.plugin,
        version: this.selectedVersion,
        variables: this.__getInstallVariables(this.variables)
      })
        .then(installData => {
          // 此处需要补充卸载状态，否则无法触发uninstalling状态修改
          this.isWorking.uninstall = false
          this.$tip.success(this.$t('service.uninstallSuccessfully'))
          this.setInstallData(installData)
          this.$emit('uninstalled')
        })
        .catch(e => {
          if (e.code === 6000) {
            this.$refs.serviceCodeErrorWindow.open(e.errorData)
            return
          }
          this.$tip.apiFailed(e)
        })
        .finally(() => {
          this.isWorking.uninstall = false
        })
    },
    /**
     * 检查变量填写情况
     * @param variables 变量集
     * @param groupName 组名，根变量无需填写
     * @returns {boolean}
     * @private
     */
    __checkVariables (variables, groupName) {
      // 开始验证
      for (const variable of variables) {
        // 查询模型 & 表
        if (variable.inputType === 'query_model' || variable.inputType === 'table') {
          // 必填且未选择值
          if (variable.required && (variable.value == null || variable.value === '')) {
            this.__tipEmptyVariable(variable, groupName)
            return false
          }
          if (variable.children == null || variable.children.length === 0) {
            continue
          }
          // 字段变量组
          for (const fieldGroup of variable.children) {
            const fieldGroupValue = fieldGroup.value
            // 字段变量
            for (const fieldVariable of fieldGroup.children) {
              if (!fieldVariable.required) {
                continue
              }
              const emptyField = fieldGroupValue.find(field => isEmptyValue(field[fieldVariable.name]))
              if (emptyField != null) {
                this.$tip.warning(
                  this.$t('service.fieldMissingValueTip',
                    {
                      fieldGroupLabel:fieldGroup.label,
                      emptyFieldName: emptyField.name,
                      fieldVariableLabel: fieldVariable.label
                    }
                  )
                )
                return false
              }
            }
          }
          continue
        }
        // select
        if (variable.inputType === 'select') {
          const selected = variable.value
          // 必填且未选择值
          if (variable.required && selected.value == null) {
            this.__tipEmptyVariable(variable, groupName)
            return false
          }
          // 选中了值，那么查看选项中的设定是否有空缺
          if (selected.value != null) {
            const selectedOption = variable.options.find(opt => opt.value === selected.value)
            if (selectedOption.settings.length > 0) {
              for (const optionSett of selectedOption.settings) {
                if (isEmptyValue(selected.settings[optionSett.name])) {
                  this.$tip.warning(
                    this.$t(
                      'service.variableMissingSettingTip',
                      {
                        variable: variable.label,
                        settingLabel: optionSett.label
                      }
                    )
                  )
                  return false
                }
              }
            }
          }
          continue
        }
        // 变量组
        if (variable.type === 'group') {
          const checkResult = this.__checkVariables(variable.children, variable.label)
          if (!checkResult) {
            return false
          }
          continue
        }
        // 普通变量
        if (variable.required && isEmptyValue(variable.value)) {
          this.__tipEmptyVariable(variable, groupName)
          return false
        }
      }
      return true
    },
    // 提示空变量
    __tipEmptyVariable (variable, groupName) {
      if (groupName != null) {
        this.$tip.warning(this.$t('service.missingGroupVariableValueTip', { variable: variable.label, groupName }))
      } else {
        this.$tip.warning(this.$t('service.missingVariableValueTip', { variable: variable.label }))
      }
    },
    // 获取安装变量值
    __getInstallVariables (variables) {
      return variables.map(variable => {
        // 如果是select，需要从option的settings中获取最新的值赋值
        if (variable.inputType === 'select') {
          const selectedOption = variable.options.find(opt => opt.value === variable.value.value)
          if (selectedOption == null) {
            return variable
          }
          const settings = {}
          for (const setting of selectedOption.settings) {
            settings[setting.name] = setting.value
          }
          variable.value.settings = settings
        }
        // 变量组
        if (variable.type === 'group') {
          variable.children = this.__getInstallVariables(variable.children)
        }
        return variable
      })
    },
    /**
     * 获取默认值
     * @param variable 变量
     * @param value 变量值，根变量无需传
     * @param isRootVariable 是否为根变量，默认为true，为true时且value为null时才会从项目配置中读取已有变量数据
     * @returns {*}
     * @private
     */
    __initVariableValue (variable, value, isRootVariable = true) {
      if (value == null && isRootVariable) {
        // 项目已安装，则从项目已安装信息中获取
        if (this.projectConfig != null) {
          // 安装的是插件
          if (this.isPlugin) {
            // 从自身服务中获取
            const pluginProject = this.projectConfig.plugins || this.projectConfig.services
            if (pluginProject != null) {
              const plugin = pluginProject[this.plugin]
              if (plugin != null) {
                // 拿到最后一个变量（变量名可重复，后者覆盖前者）
                const targetVar = plugin.variables.findLast(v => v.name === variable.name)
                if (targetVar != null) {
                  value = targetVar.value
                }
              }
            }
            // 如果没有获取到值，则还可以从主服务中获取
            if (value == null) {
              const serviceObject = this.projectConfig.service || this.projectConfig.main
              if (serviceObject != null) {
                let service = null
                for (const key in serviceObject) {
                  service = key
                  break
                }
                /**
                 * 此处存在漏洞，例如主服务中存在queryFields，子服务中也存在queryFields，但他们想要表达的不是同一层含义。
                 * 对比默认值和主服务中的值，如果类型不匹配，则不视为是同一层含义，此时将value置为null。
                 * 但这样依然可能存在类型相同但含义不同的情况，为少数情况，暂不做处理
                 */
                const valueFromService = serviceObject[service].variables[variable.name]
                value = valueFromService
                if (valueFromService != null && valueFromService.constructor !== variable.defaultValue.constructor) {
                  value = null
                }
              }
            }
          }
          // 安装的是服务
          else {
            const serviceObject = this.projectConfig.service || this.projectConfig.main
            if (serviceObject != null) {
              const service = serviceObject[this.service]
              if (service != null) {
                // 拿到最后一个变量（变量名可重复，后者覆盖前者）
                const targetVar = service.variables.findLast(v => v.name === variable.name)
                if (targetVar != null) {
                  value = targetVar.value
                }
              }
            }
          }
        }
      }
      /**
       * value不为null时，是从项目配置中读取出来的，此时需要做转换
       */
      if (value != null) {
        /**
         * 表格和查询模型值处理
         * 表格和查询模型的存储结构如下
         * {
         *   value: 选中的表名或模型ID,
         *   settings: {
         *     字段变量组1: [已选中的字段和自定义字段变量值]
         *   }
         * }
         * 要初始化值，需要将variable.children（也就是字段变量组）的value值给定为settings下的组值
         */
        if (variable.inputType === 'table' || variable.inputType === 'query_model') {
          for (const groupName in value.settings) {
            const targetGroup = variable.children.find(group => group.name === groupName)
            if (targetGroup == null) {
              continue
            }
            /**
             * 获取组变量值，如”查询字段列表“，是一个字段数组，且数组中的字段包括了各个自定义字段的值
             * 基本结构如下
             * [
             *   { ...字段基础信息, ...自定义字段信息 }
             * ]
             * e.g，如下name字段包括输入模式inputType（字典选择）和输入模式的配置inputTypeSettings，其中inputTypeSettings.dictName表示进一步配置的字典名称
             * [
             *   { name: 'NAME', alias: 'name', inputType: 'dict', inputTypeSettings: { dictName: 'genders' } }
             * ]
             */
            let selectedFields = value.settings[groupName]
            /**
             * targetGroup.children为自定义变量的信息
             * e.g
             * [
             *   {
             *     defaultValue: '',
             *     type: 'variable',
             *     inputType: 'select', // 变量输入类型
             *     options: [], // 配置的变量选项，为checkbox，radio或select时就需要配置选项
             *     ...
             *   }
             * ]
             */
            for (const fieldVariable of targetGroup.children) {
              // 对于字段，仅需要处理select类型变量
              if (fieldVariable.inputType !== 'select') {
                continue
              }
              /**
               * 循环字段，逐一处理。
               * 对于表或查询模型中的字段变量，配置文件中记录的格式是
               * {
               *   inputType: 'select',
               *   inputTypeSettings: {
               *     dictName: 'genders'
               *   }
               * }
               * 但select组件需要的格式如下
               * {
               *   inputType: {
               *     value: 'select',
               *     settings: {
               *       dictName: 'genders'
               *     }
               *   }
               * }
               * 此处做一个格式转换即可
               */
              for (const field of selectedFields) {
                field[fieldVariable.name] = {
                  value: field[fieldVariable.name],
                  settings: field[`${fieldVariable.name}Settings`]
                }
                delete field[`${fieldVariable.name}Settings`]
              }
            }
            targetGroup.value = value.settings[groupName]
          }
          variable.value = value.value
          return variable
        }
        // 变量组
        if (variable.type === 'group') {
          variable.children.forEach(item => {
            return this.__initVariableValue(item, value[item.name], false)
          })
          return variable
        }
        variable.value = value
        return variable
      }

      /**
       * value为null，读取变量默认值
       */
      value = variable.defaultValue
      value = value == null ? getDefaultEmptyValue(variable.inputType) : value
      /**
       * 表和模型，每个组都需要给定value值
       */
      if (variable.inputType === 'table' || variable.inputType === 'query_model') {
        // 表和模型的下一级为字段变量组，对于字段变量组需要给定value值
        if (variable.children != null) {
          for (const group of variable.children) {
            group.value = group.defaultValue
          }
        }
        variable.value = value
        return variable
      }
      /**
       * 变量组，给子变量的value赋值为默认值
       */
      if (variable.type === 'group') {
        if (variable.children != null) {
          variable.children.forEach(item => {
            item.value = item.defaultValue
          })
        }
        return variable
      }
      variable.value = value
      return variable
    }
  },
  created () {
    this.fetchVersion()
  }
}
</script>

<style scoped lang="scss">
.service-installer {
  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title {
      align-items: center;
      display: flex;
      h4 {
        font-size: var(--font-size-title);
      }
      :deep(.el-select) {
        width: 100px;
        position: relative;
        left: -3px;
        .el-input__wrapper {
          box-shadow: none !important;
        }
        .el-input__inner {
          color: var(--color-service-name);
          font-size: var(--font-size-title);
          font-weight: bold;
        }
      }
    }
    // 安装按钮
    .install {
      flex-shrink: 0;
      margin-left: 50px;
      width: 155px;
      .el-button {
        width: 100%;
        height: 40px;
        font-size: var(--font-size-middle);
      }
    }
  }
  .content-wrap {
    border-top: 3px solid;
    border-image: var(--border-colors);
    padding-top: 20px;
    margin-top: 20px;
    .install-tip {
      margin-bottom: 10px;
    }
    // 变量表单
    .form-wrap {
      :deep(.el-form-item__label) {
        padding-right: 0;
        .label-wrap {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
      .group-vars {
        width: 100%;
        em {
          color: var(--el-color-danger);
          margin-right: 2px;
          font-style: normal;
        }
      }
      :deep(.el-input__inner) {
        color: var(--color-value);
        font-size: 16px;
        font-weight: bold;
      }
    }
    // 参数空提示
    .parameters-holder {
      display: flex;
      justify-content: center;
      padding: 50px 0;
      p {
        width: 60%;
        font-size: var(--font-size-middle);
        color: var(--color-gray);
        line-height: 25px;
      }
    }
  }
}
</style>
