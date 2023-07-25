<template>
  <div class="build-notice" :class="{ visible: buildsLength > 0 }">
    <ul>
      <li v-for="(build,index) in builds" :key="build.name">
        <div class="title">
          <h3>{{build.name}}</h3>
          <el-button type="text" size="small" @click="viewScript(build)">View Script</el-button>
        </div>
        <div class="opera">
          <el-button @click="ignore(build)">Ignore</el-button>
          <el-button type="primary" :disabled="build.__executing" @click="execute(build)">Execute</el-button>
        </div>
      </li>
    </ul>
    <div v-if="builds.length > 1" class="opera">
      <el-button @click="ignoreAll">Ignore all</el-button>
      <el-button type="primary" :disabled="anyExecuting" @click="executeAll">Execute all</el-button>
    </div>
    <el-dialog
      custom-class="view-script-dialog"
      v-model="dialogData.visible"
      :title="dialogData.build.name"
      append-to-body
    >
      <el-input type="textarea" :model-value="dialogData.build.content"></el-input>
      <div class="opera">
        <el-button @click="ignore(dialogData.build)">Ignore</el-button>
        <el-button type="primary" :disabled="dialogData.build.__executing" @click="execute(dialogData.build)">Execute</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {build} from "../../../api/service.compile";
import {mapState} from "vuex";

export default {
  name: "BuildNotice",
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
      console.log('this.installData', this.installData)
      return this.installData.builds
    },
    buildsLength () {
      return this.builds.length
    },
    anyExecuting () {
      return this.executing || this.builds.filter(b => b.__executing === true).length > 0
    }
  },
  methods: {
    // 显示脚本
    viewScript (build) {
      this.dialogData.visible = true
      this.dialogData.build = build
    },
    // 忽略
    ignore (build) {
      const index = this.builds.findIndex(b => b === build)
      if (index === -1) {
        return
      }
      this.installData.builds.splice(index, 1)
    },
    // 忽略所有
    ignoreAll () {
      this.installData.builds.splice(0, this.builds.length)
    },
    // 执行构建
    execute (item) {
      if (item.__executing) {
        return
      }
      item.__executing = true
      const index = this.builds.find(b => b === item)
      build({
        ...this.installData,
        builds: [item]
      })
        .then(() => {
          this.installData.builds.splice(index, 1)
          this.$tip.success(`${item.name} build successfully`)
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
        ...this.installData,
        builds: this.builds
      })
        .then(() => {
          this.installData.builds.splice(0, this.builds.length)
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
