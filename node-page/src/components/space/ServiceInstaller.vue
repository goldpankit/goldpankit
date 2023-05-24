<template>
  <div class="service-installer">
    <div v-if="withBreadcrumbs" class="nav">
      <div class="title">
        <el-button class="button-icon" icon="ArrowLeftBold" @click="$emit('back')"></el-button>
        <h4>{{service.name}}{{serviceVersion == null ? '' : ' · ' + serviceVersion.toUpperCase()}} · Install</h4>
      </div>
    </div>
    <div class="content-wrap">
      <p class="install-tip">
        tips: Install the service by filling out the form below and clicking the Install button at the bottom.
      </p>
      <el-form>
        <el-form-item
          v-for="variable in variables"
          :key="variable.name"
          :label="variable.message"
        >
          <VariableInput :variable="variable"/>
        </el-form-item>
      </el-form>
      <div v-if="withInstallButton" class="install">
        <el-button type="important" :disabled="currentProject == null" @click="install">
          INSTALL{{currentProject == null ? '' : ' to project ' + currentProject.name}}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import InstallCheckbox from "../service/installer/Checkbox.vue";
import InstallInput from "../service/installer/Input.vue";
import {compile} from "../../api/service.compile";
import InstallRadio from "../service/installer/Radio.vue";
import VariableInput from "../service/installer/VariableInput.vue";

export default {
  name: "ServiceInstaller",
  components: {VariableInput, InstallRadio, InstallInput, InstallCheckbox},
  props: {
    space: {
      required: true
    },
    service: {
      required: true
    },
    serviceVersion: {
      required: false
    },
    withBreadcrumbs: {
      default: false
    },
    withInstallButton: {
      default: false
    }
  },
  data () {
    return {
      variables: []
    }
  },
  computed: {
    ...mapState(['currentProject'])
  },
  methods: {
    // 安装服务
    install () {
      compile({
        space: this.space,
        service: this.service,
        projectId: this.currentProject.id,
        variables: this.variables
      })
        .then(() => {
          this.$emit('success')
        })
        .catch(e => {
          this.$emit('error', e)
        })
    },
    // 获取默认值
    __getVariableDefaultValue (variable) {
      return variable === 'checkbox' ? [] : ''
    }
  },
  created () {
    this.variables = JSON.parse(this.service.variables).map(item => {
      return {
        ...item,
        value: this.__getVariableDefaultValue(item)
      }
    })
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
    padding: 50px;
    .install-tip {
      margin-bottom: 20px;
      font-weight: bold;
    }
    .write-tip {
      margin-bottom: 10px;
    }
    .el-form {
      padding: 30px;
      box-shadow: var(--form-shadow);
      border-radius: var(--radius-page);
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
