<template>
  <div class="service-installer">
    <div v-if="withTitle" class="nav">
      <div class="title">
        <h4>@{{space}}/{{service}}{{version == null ? '' : ' · ' + version.toUpperCase()}} · {{$t('service.install2')}}</h4>
      </div>
    </div>
    <div class="content-wrap">
      <template v-if="withProject || serviceVariables.length > 0">
        <p class="install-tip">{{$t('service.withParametersTip')}}</p>
        <div class="form-wrap">
          <el-form>
            <el-form-item v-if="withProject" :label="$t('project.project')" required class="form-item-project">
              <ProjectSelect
                :model-value="currentProject"
                :with-block="true"
                :with-prefix="false"
              />
              <div class="form-item-tip" v-if="currentProjectDetail != null">
                <el-icon><InfoFilled /></el-icon>
                <p>
                  服务安装后代码将写入<em>{{currentProjectDetail.codespace}}</em>目录。
                </p>
              </div>
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
                <div
                  v-if="variable.inputType === 'datasource' && currentDatabaseDetail != null"
                  class="form-item-tip"
                >
                  <el-icon><InfoFilled /></el-icon>
                  <p>
                    基础信息：{{currentDatabaseDetail.host}}:{{currentDatabaseDetail.port}}/{{currentDatabaseDetail.schema}}
                  </p>
                </div>
              </el-form-item>
            </template>
          </el-form>
        </div>
      </template>
      <div v-else class="parameters-holder">
        <p>{{$t('service.withoutParametersTip')}}</p>
      </div>
      <div v-if="withInstallButton" class="install">
        <el-button type="important" @click="install" :disabled="isWorking.install">
          {{ isWorking.install ? $t('service.installing') : $t('service.install') }}
        </el-button>
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

export default {
  name: "ServiceInstaller",
  components: {
    ServiceCodeErrorWindow,
    MergeWindow,
    ProjectSelect,
    DirectorySelect,
    FieldSetting, MySqlFieldSelect, VariableInput, InstallRadio, InstallInput, InstallCheckbox},
  props: {
    installing: {},
    uninstalling: {},
    space: {
      required: true
    },
    service: {
      required: true
    },
    serviceType: {
      required: true
    },
    servicePrice: {
      required: true
    },
    serviceLease: {
      required: false
    },
    version: {
      required: true
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
      variables: []
    }
  },
  computed: {
    ...mapState(['currentProject', 'currentProjectDetail', 'currentDatabase', 'currentDatabaseDetail']),
    // 服务变量集
    serviceVariables () {
      return this.variables
    },
    unique () {
      return [this.space, this.service, this.version]
    }
  },
  watch: {
    unique () {
      this.fetchVersion()
    },
    'isWorking.install': function () {
      this.$emit('update:installing', this.isWorking.install)
    },
    'isWorking.uninstall': function () {
      this.$emit('update:uninstalling', this.isWorking.uninstall)
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
        version: this.version
      })
        .then(data => {
          this.variables = JSON.parse(data.variables).map(item => {
            return this.__initVariableValue(item)
          })
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
        serviceType: this.serviceType,
        version: this.version,
        variables
      })
        .then(installData => {
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
        serviceType: this.serviceType,
        version: this.version,
        variables: this.__getInstallVariables(this.variables)
      })
        .then(installData => {
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
    // 检查变量
    __checkVariables (variables, groupName) {
      // 开始验证
      for (const variable of variables) {
        // 查询模型 & 表
        if (variable.inputType === 'query_model' || variable.inputType === 'table') {
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
        if (isEmptyValue(variable.value)) {
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
    // 获取默认值
    __initVariableValue (variable, value) {
      if (value == null) {
        // 项目已安装，则从项目已安装信息中获取
        if (this.projectConfig != null) {
          const service = this.projectConfig.services[this.service]
          // 从自身服务中获取
          if (service != null) {
            // 拿到最后一个变量（变量名可重复，后者覆盖前者）
            const targetVar = service.variables.findLast(v => v.name === variable.name)
            if (targetVar != null) {
              value = targetVar.value
            }
          }
          // 如果没有获取到值，则还可以从主服务中获取
          if (value == null) {
            let mainService = null
            for (const key in this.projectConfig.main) {
              mainService = key
              break
            }
            /**
             * 此处存在漏洞，例如主服务中存在queryFields，子服务中也存在queryFields，但他们想要表达的不是同一层含义。
             * 对比默认值和主服务中的值，如果类型不匹配，则不视为是同一层含义，此时将value置为null。
             * 但这样依然可能存在类型相同但含义不同的情况，为少数情况，暂不做处理
             */
            const valueFromMain = this.projectConfig.main[mainService].variables[variable.name]
            value = valueFromMain
            if (valueFromMain != null && valueFromMain.constructor !== variable.defaultValue.constructor) {
              value = null
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
            targetGroup.value = value.settings[groupName]
          }
          variable.value = value.value
          return variable
        }
        if (variable.type === 'group') {
          variable.children.forEach(item => {
            return this.__initVariableValue(item, value[item.name])
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
        for (const group of variable.children) {
          group.value = group.defaultValue
        }
        variable.value = value
        return variable
      }
      /**
       * 变量组，给子变量的value赋值为默认值
       */
      if (variable.type === 'group') {
        variable.children.forEach(item => {
          item.value = item.defaultValue
        })
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
    }
  }
  .content-wrap {
    // padding: 50px;
    .install-tip {
      margin-top: 10px;
      margin-bottom: 10px;
    }
    // 变量表单
    .form-wrap {
      border-top: 3px solid;
      border-image: var(--border-colors);
      padding-top: 20px;
      margin-top: 20px;
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
    // 安装按钮
    .install {
      margin-top: 50px;
      .el-button {
        width: 100%;
        height: 70px;
        font-size: var(--font-size-large);
        font-weight: bold;
      }
    }
    // 提示
    .form-item-tip {
      display: flex;
      margin-top: 5px;
      .el-icon {
        margin-top: 4px;
        margin-right: 5px;
      }
      p {
        color: var(--color-gray);
        line-height: 1.5;
        em {
          font-weight: bold;
          font-style: normal;
          color: var(--font-color);
          margin: 0 5px;
        }
      }
    }
  }
}
</style>
