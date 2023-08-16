<template>
  <div class="build-notice" :class="{ visible: buildsLength > 0 }">
    <ul>
      <li v-for="(build,index) in builds" :key="build.name">
        <div class="title">
          <h3>{{build.name}}</h3>
          <el-button type="text" size="small" @click="viewScript(build)">{{$t('service.build.viewScript')}}</el-button>
        </div>
        <div v-if="build.type === 'MySQL'" class="target-datasource">
          <DataSourceSelect
            :model-value="installData.build.dataSourceId"
            :prefix="$t('service.build.targetDataSource')"
            :with-block="true"
            @change="changeDataSource"
          />
        </div>
        <div class="opera">
          <el-button @click="ignore(build)">{{$t('service.build.ignore')}}</el-button>
          <el-button type="primary" :disabled="build.__executing" @click="execute(build)">{{$t('service.build.execute')}}</el-button>
        </div>
      </li>
    </ul>
    <div v-if="builds.length > 1" class="opera">
      <el-button @click="ignoreAll">{{$t('service.build.ignoreAll')}}</el-button>
      <el-button type="primary" :disabled="anyExecuting" @click="executeAll">{{$t('service.build.executeAll')}}</el-button>
    </div>
    <el-dialog
      custom-class="view-script-dialog"
      v-model="dialogData.visible"
      :title="dialogData.build.name"
      append-to-body
    >
      <DataSourceSelect
        v-if="dialogData.build.type === 'MySQL'"
        :model-value="installData.build.dataSourceId"
        :prefix="$t('service.build.targetDataSource')"
        :with-block="true"
        @change="changeDataSource"
      />
      <el-input type="textarea" :model-value="dialogData.build.content"></el-input>
      <div class="opera">
        <el-button @click="ignore(dialogData.build)">{{$t('service.build.ignore')}}</el-button>
        <el-button type="primary" :disabled="dialogData.build.__executing" @click="execute(dialogData.build)">{{$t('service.build.execute')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {build} from "../../../api/service.compile";
import {mapMutations, mapState} from "vuex";
import DataSourceSelect from "../../database/DataSourceSelect.vue";

export default {
  name: "BuildNotice",
  components: {DataSourceSelect},
  data () {
    return {
      executing: false,
      dialogData: {
        build: {
          name: '',
          content: ''
        },
        visible: false
      }
    }
  },
  computed: {
    ...mapState(['installData']),
    builds () {
      if (this.installData == null) {
        return []
      }
      return this.installData.build.builds
    },
    buildsLength () {
      return this.builds.length
    },
    anyExecuting () {
      return this.executing || this.builds.filter(b => b.__executing === true).length > 0
    }
  },
  methods: {
    ...mapMutations(['setInstallData']),
    // 修改数据源
    changeDataSource (dataSourceId) {
      this.setInstallData({
        build: {
          ...this.installData.build,
          dataSourceId: dataSourceId
        }
      })
    },
    // 显示脚本
    viewScript (build) {
      this.dialogData.visible = true
      this.dialogData.build = build
    },
    // 忽略
    ignore (build) {
      const index = this.builds.findIndex(b => b === build)
      if (index === -1) {
        this.dialogData.visible = false
        return
      }
      this.installData.build.builds.splice(index, 1)
      this.dialogData.visible = false
    },
    // 忽略所有
    ignoreAll () {
      this.installData.build.builds.splice(0, this.builds.length)
    },
    // 执行构建
    execute (item) {
      // 数据库构建，但没选中数据库
      if (item.type === 'MySQL' && (this.installData.build.dataSourceId == null || this.installData.build.dataSourceId === '')) {
        this.$tip.warning(this.$t('service.noneDataSourceTip'))
        return
      }
      if (item.__executing) {
        return
      }
      item.__executing = true
      const index = this.builds.find(b => b === item)
      build({
        ...this.installData.build,
        builds: [item]
      })
        .then(() => {
          this.installData.build.builds.splice(index, 1)
          this.$tip.success(`「${item.name}」${this.$t('service.build.completed')}`)
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
        .finally(() => {
          item.__executing = false
        })
    },
    // 执行构建
    executeAll () {
      build({
        ...this.installData.build,
        builds: this.builds
      })
        .then(() => {
          this.installData.build.builds.splice(0, this.builds.length)
          this.$tip.success(`Build successfully`)
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    }
  }
}
</script>

<style scoped lang="scss">
.build-notice {
  width: 450px;
  position: fixed;
  right: 20px;
  bottom: 20px;
  padding: 20px;
  max-height: 80%;
  overflow-y: auto;
  transform: translateX(2000px);
  transition: all ease .15s;
  &.visible {
    transform: translateX(0);
  }
  li {
    margin-top: 15px;
    padding: 30px;
    border-radius: 10px;
    background: var(--color-light);
    box-shadow: var(--page-shadow);
    .title {
      display: flex;
      justify-content: space-between;
      .el-button {
        flex-shrink: 0;
        margin-left: 50px;
      }
    }
    .target-datasource {
      margin-top: 10px;
    }
    .opera {
      margin-top: 10px;
      display: flex;
      justify-content: flex-end;
    }
  }
  & > .opera {
    margin-top: 10px;
    background: var(--color-light);
    padding: 10px;
    display: flex;
    justify-content: center;
    box-shadow: var(--page-shadow);
  }
}
</style>
<style lang="scss">
.view-script-dialog {
  .el-dialog__body {
    padding-top: 10px;
  }
  .data-source-select {
    margin-bottom: 10px;
  }
  .el-textarea {
    border: 0;
  }
  .el-textarea__inner {
    height: 500px;
    border: 0;
  }
  .opera {
    padding: 20px 0 0 0;
    display: flex;
    justify-content: center;
  }
}
</style>
