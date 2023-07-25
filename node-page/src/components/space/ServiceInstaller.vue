<template>
  <div class="service-installer">
    <div v-if="withBreadcrumbs" class="nav">
      <div class="title">
        <el-button class="button-icon" icon="ArrowLeftBold" @click="$emit('back')"></el-button>
        <h4>{{service}}{{version == null ? '' : ' · ' + version.toUpperCase()}} · Install</h4>
      </div>
    </div>
    <div class="content-wrap">
      <template v-if="withProject || serviceVariables.length > 0">
        <p class="install-tip">
          tips: Install the service by filling out the form below and clicking the Install button at the bottom.
        </p>
        <div class="form-wrap">
          <el-form>
            <el-form-item v-if="withProject" label="Project" required>
              <ProjectSelect
                :model-value="currentProject"
                :with-block="true"
                :with-prefix="false"
                @change="setCurrentProject"
              />
            </el-form-item>
            <template v-for="variable in serviceVariables">
              <el-form-item
                v-if="!variable.hidden"
                :key="variable.name"
                :label="variable.label"
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
                <VariableInput v-if="variable.type === 'variable'" :variable="variable" :variables="variables"/>
                <!-- 服务变量组 -->
                <ul v-else-if="variable.type === 'group'" class="group-vars">
                  <li v-for="v of variable.children" :key="`${variable.name}_${v.name}`">
                    <label class="text-info-1 text-mini">{{v.label}}</label>
                    <VariableInput :variable="v"/>
                  </li>
                </ul>
              </el-form-item>
            </template>
          </el-form>
        </div>
      </template>
      <div v-else class="parameters-holder">
        <p>This service does not have any parameters, click the INSTALL button at the bottom to install.</p>
      </div>
      <div v-if="withInstallButton" class="install">
        <el-button type="important" @click="install" :disabled="isWorking.install">
          {{ isWorking.install ? 'INSTALLING...' : 'INSTALL' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapState} from "vuex";
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

export default {
  name: "ServiceInstaller",
  components: {
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
    version: {
      required: true
    },
    // 是否包含项目信息
    withProject: {
      default: true
    },
    // 项目配置信息（项目安装完服务后的配置信息）
    projectConfig: {},
    withBreadcrumbs: {
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
    ...mapState(['currentProject', 'currentDatabase']),
    // 服务变量集
    serviceVariables () {
      return this.variables.filter(v => v.scope === 'service')
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
    ...mapMutations(['setCurrentProject', 'setInstallData']),
    // 获取版本信息
    fetchVersion () {
      fetchVersion({
        space: this.space,
        service: this.service,
        version: this.version
      })
        .then(data => {
          this.variables = JSON.parse(data.variables).map(item => {
            // 根服务变量
            if (item.type === 'variable' && item.scope === 'service') {
              return {
                ...item,
                value: this.__getVariableValue(item)
              }
            }
            // 根服务变量组
            if (item.type === 'group' && item.scope === 'service') {
              item.children = item.children.map(v => {
                return {
                  ...v,
                  value: this.__getVariableValue(v)
                }
              })
              return item
            }
            // 表字段变量组
            if (item.type === 'group' && item.scope === 'table_field') {
              item.value = this.__getVariableValue(item)
              return item
            }
            return item
          })
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 安装服务
    install () {
      if (this.isWorking.install) {
        return
      }
      this.isWorking.install = true
      // 安装服务
      install({
        projectId: this.currentProject,
        database: this.currentDatabase,
        space: this.space,
        service: this.service,
        version: this.version,
        variables: this.variables
      })
        .then(installData => {
          this.$tip.success('Install Successfully')
          this.setInstallData(installData)
          this.$emit('installed')
        })
        .catch(e => {
          this.$tip.apiFailed(e)
          this.$emit('error', e)
        })
        .finally(() => {
          this.isWorking.install = false
        })
    },
    // 卸载服务
    uninstall () {
      if (this.isWorking.uninstall) {
        return
      }
      this.isWorking.uninstall = true
      uninstall({
        projectId: this.currentProject,
        database: this.currentDatabase,
        space: this.space,
        service: this.service,
        version: this.version,
        variables: this.variables
      })
        .then(installData => {
          this.$tip.success('Uninstall Successfully')
          this.setInstallData(installData)
          this.$emit('uninstalled')
        })
        .catch(e => {
          this.$tip.apiFailed(e)
          this.$emit('error', e)
        })
        .finally(() => {
          this.isWorking.uninstall = false
        })
    },
    // 获取默认值
    __getVariableValue (variable) {
      let value = null
      // 项目已安装，则从项目已安装信息中获取
      if (this.projectConfig != null) {
        const service = this.projectConfig.services[this.service]
        // 从自身服务中获取
        if (service != null) {
          value = service.variables[variable.name]
        }
        // 如果没有获取到值 && 变量为变量类型 || 服务变量组类型，则还可以从主服务中获取
        if (value == null &&
            (variable.type === 'variable' ||
            (variable.type === 'group' && variable.scope === 'service'))
        ) {
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
      // 如果从已安装的自身服务和主服务中均为获取到，则使用默认值
      if (value == null) {
        value = variable.defaultValue
      }
      return value
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
      .el-button {
        border: 0;
      }
      h4 {
        font-size: var(--font-size-middle);
      }
    }
  }
  .content-wrap {
    // padding: 50px;
    .install-tip {
      margin-bottom: 20px;
      font-weight: bold;
    }
    .write-tip {
      margin-bottom: 10px;
    }
    // 变量表单
    .form-wrap {
      padding: 30px;
      box-shadow: var(--form-shadow);
      border-radius: var(--radius-page);
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
  }
}
</style>
