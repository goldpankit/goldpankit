<template>
  <div class="service-installer">
    <div class="nav">
      <div class="title">
        <el-button class="button-icon" icon="ArrowLeftBold" @click="$emit('back')"></el-button>
        <h4>{{frameworkService.name}} · {{frameworkServiceVersion.toUpperCase()}} · Install</h4>
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
          <InstallInput v-if="variable.inputType === 'input'" v-model="variable.value" placeholder="com.kit"/>
          <InstallCheckbox v-else-if="variable.inputType === 'checkbox'" :options="variable.options"/>
        </el-form-item>
      </el-form>
      <div class="install">
        <el-button type="important" @click="install">
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

export default {
  name: "ServiceInstaller",
  components: {InstallInput, InstallCheckbox},
  props: {
    serviceSpace: {
      required: true
    },
    frameworkService: {
      required: true
    },
    frameworkServiceVersion: {
      required: true
    }
  },
  data () {
    return {
      variables: [
        {
          name: 'basicPackage',
          message: '基础包名',
          inputType: 'input',
          compiler: 'static',
          value: '',
          remark: ''
        },
        {
          name: 'port',
          message: '端口号',
          inputType: 'input',
          compiler: 'static',
          value: '',
          remark: ''
        },
        {
          name: 'cacheType',
          message: '缓存',
          inputType: 'checkbox',
          compiler: 'static',
          remark: '',
          options: [
            { name: 'memory', label: '内存缓存', remark: '' },
            { name: 'redis', label: 'Redis单机版', remark: '' },
            { name: 'redis-plus', label: 'Redis高可用版', remark: '' }
          ]
        }
      ]
    }
  },
  computed: {
    ...mapState(['currentProject'])
  },
  methods: {
    // 安装服务
    install () {
      console.log('this.serviceSpace', this.serviceSpace)
      compile({
        space: this.serviceSpace,
        framework: this.frameworkService,
        projectId: this.currentProject.id,
        variables: []
      })
        .then(() => {
          this.$router.push({ name: 'Workbench' })
        })
        .catch(e => {
          console.log('e', e)
        })
    }
  },
  created () {
    console.log('frameworkService', this.frameworkService)
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