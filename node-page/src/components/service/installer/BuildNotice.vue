<template>
  <div class="build-notice" :class="{ visible: builds.length > 0 }">
    <h2>执行构建</h2>
    <el-button class="button-close" @click="ignoreAll" icon="Close"/>
    <ul>
      <li v-for="(build,index) in builds" :key="build.name">
        <div class="title">
          <h3>{{index + 1}}、{{build.name}}</h3>
          <el-button type="text" size="small" @click="$refs.scriptPreviewDialog.open(build)">查看构建脚本</el-button>
        </div>
        <div v-if="build.type === 'MySQL'" class="target-datasource">
          <DataSourceSelect
            :model-value="currentDatabase"
            :prefix="$t('service.build.targetDataSource')"
            :with-block="true"
          />
        </div>
        <div class="opera">
          <el-button type="primary" @click="ignore(build)">忽略此项构建</el-button>
          <el-button type="important2" :disabled="build.__executing" @click="execute(build)">执行该脚本</el-button>
        </div>
      </li>
    </ul>
    <!-- 执行SQL构建脚本窗口 -->
    <el-dialog
      v-if="currentBuild != null && currentDatabaseDetail != null"
      title="执行构建脚本"
      v-model="exactConfirmData.visible"
      custom-class="exact-confirm-script-dialog"
      width="685px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      append-to-body
    >
      <h4>构建脚本：{{currentBuild.name}}</h4>
      <DataSourceSelect
        :model-value="currentDatabase"
        :prefix="$t('service.build.targetDataSource')"
        :with-block="true"
      />
      <div class="warning-wrap text-bold">警告：该操作可能会影响项目的正常运行，请谨慎操作！</div>
      <div class="warning-wrap">
        <p>构建脚本是服务或插件预设的代码，我们不敢保证发布者编写的代码中一定不存在<b style="margin: 0 3px;">删库、删表，以及对数据的增删改</b>等敏感操作，<em>请务必检查执行脚本内容是否符合预期或存在安全隐患！</em></p>
        <p>脚本将在以下数据库执行，为防止误操作，确认继续操作请输入下方数据库全路径：</p>
        <p class="confirm-text">{{ currentDatabaseText }}</p>
      </div>
      <el-input v-model="exactConfirmData.value" placeholder="请输入数据库名称" @input="exactConfirmData.error = ''"/>
      <p class="error-tip">{{ exactConfirmData.error }}</p>
      <div class="opera">
        <el-button :disabled="currentBuild.__executing" @click="exactConfirmData.visible = false">取消</el-button>
        <el-button type="primary" @click="$refs.scriptPreviewDialog.open(currentBuild)">检查脚本</el-button>
        <el-button
          type="important2"
          :disabled="exactConfirmData.value.trim() === '' || currentBuild.__executing"
          :loading="currentBuild.__executing"
          @click="confirmExecute(currentBuild)"
        >确认执行脚本</el-button>
      </div>
    </el-dialog>
    <!-- 执行其它构建脚本窗口 -->
    <el-dialog
      v-if="currentBuild != null"
      title="执行构建脚本"
      v-model="confirmData.visible"
      custom-class="confirm-script-dialog"
      width="400px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      append-to-body
    >
      <p>构建脚本是服务或插件预设的代码，我们不敢保证发布者编写的代码中一定不存在，请务必检查脚本内容以确保脚本能在您的机器上安全的运行！确认执行<em>「{{currentBuild.name}}」</em>构建脚本吗？</p>
      <div class="opera">
        <el-button :disabled="currentBuild.__executing" @click="cancelBuild">取消</el-button>
        <el-button type="primary" @click="$refs.scriptPreviewDialog.open(currentBuild)">检查脚本</el-button>
        <el-button
          type="important2"
          :disabled="currentBuild.__executing"
          :loading="currentBuild.__executing"
          @click="confirmExecute(currentBuild)"
        >确认执行脚本</el-button>
      </div>
    </el-dialog>
    <!-- 查看脚本窗口 -->
    <ScriptPreviewDialog
      ref="scriptPreviewDialog"
      @ignore="ignore"
      @execute="execute"
    />
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import DataSourceSelect from '@/components/database/DataSourceSelect'
import { build } from '@/api/service.compile'
import ScriptPreviewDialog from "@/components/service/installer/ScriptPreviewDialog.vue";

export default {
  name: "BuildNotice",
  components: {ScriptPreviewDialog, DataSourceSelect },
  data () {
    return {
      executing: false,
      // 当前执行的构建对象
      currentBuild: null,
      // 确认执行脚本窗口
      exactConfirmData: {
        visible: false,
        value: '',
        error: ''
      },
      confirmData: {
        visible: false
      }
    }
  },
  computed: {
    ...mapState(['currentProject', 'currentDatabase', 'currentDatabaseDetail', 'installData']),
    builds () {
      if (this.installData == null) {
        return []
      }
      return this.installData.build.builds
    },
    // 执行的数据源名称
    currentDatabaseText () {
      if (this.currentDatabaseDetail == null) {
        return ''
      }
      return `${this.currentDatabaseDetail.host}:${this.currentDatabaseDetail.port}/${this.currentDatabaseDetail.schema}`
    }
  },
  methods: {
    ...mapMutations(['setInstallData']),
    // 取消构建
    cancelBuild () {
      if (this.currentBuild.__executing) {
        return
      }
      this.confirmData.visible = false
      this.exactConfirmData.visible = false
    },
    // 忽略
    ignore (build) {
      // 关闭确认构建窗口
      this.confirmData.visible = false
      this.exactConfirmData.visible = false
      // 移除构建
      const index = this.builds.findIndex(b => b === build)
      if (index !== -1) {
        this.installData.build.builds.splice(index, 1)
      }
      // 清空选择
      this.currentBuild = null
    },
    // 忽略所有
    ignoreAll () {
      this.installData.build.builds.splice(0, this.builds.length)
    },
    // 执行构建
    execute (item) {
      this.currentBuild = item
      // 数据库构建，但没选中数据库
      if (this.currentBuild.type === 'MySQL' && (this.currentDatabase == null || this.currentDatabase === '')) {
        this.$tip.warning('请先选择数据库')
        return
      }
      // 数据库构建
      if (this.currentBuild.type === 'MySQL') {
        this.exactConfirmData.value = ''
        this.exactConfirmData.visible = true
        return
      }
      // 其它脚本构建
      this.confirmData.visible = true
    },
    // 确认执行
    confirmExecute (buildItem) {
      // 如果执行的是SQL脚本，则需要验证数据源名称是否匹配
      if (buildItem.type === 'MySQL') {
        if (this.currentDatabaseText !== this.exactConfirmData.value) {
          this.exactConfirmData.error = '数据源名称错误'
          return
        }
      }
      if (buildItem.__executing) {
        return
      }
      buildItem.__executing = true
      const index = this.builds.findIndex(b => b === buildItem)
      build({
        dataSourceId: this.currentDatabase,
        projectId: this.currentProject,
        builds: [buildItem]
      })
        .then(() => {
          this.currentBuild = null
          this.installData.build.builds.splice(index, 1)
          this.$tip.success(`「${buildItem.name}」构建完成`)
          // 关闭确认窗口
          this.exactConfirmData.visible = false
          this.confirmData.visible = false
        })
        .catch(e => {
          this.exactConfirmData.error = e.message
        })
        .finally(() => {
          buildItem.__executing = false
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
  bottom: 0;
  padding: 20px 20px 50px 20px;
  max-height: 80%;
  overflow-y: auto;
  transform: translateY(2000px);
  transition: all ease .5s;
  z-index: 99;
  background: rgba(46, 52, 68, .8);
  border-radius: 10px 10px 0 0;
  &.visible {
    transform: translateX(0);
  }
  h2 {
    margin-bottom: 20px;
    text-align: center;
    color: #fff;
    font-size: 20px;
  }
  // 关闭按钮
  .button-close {
    position: absolute;
    top: 12px;
    right: 10px;
    width: 40px;
    height: 40px;
    border: 0;
    background-color: transparent;
    color: #eee;
    font-size: 25px;
    font-weight: bold;
    transition: all ease .5s;
    &:hover {
      color: #fff;
      transform: rotate(180deg);
    }
  }
  li {
    margin-top: 15px;
    padding: 30px;
    border-radius: 10px;
    background: var(--color-light);
    &:first-of-type {
      margin-top: 0;
    }
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      h3 {
        font-size: 14px;
      }
      .el-button {
        flex-shrink: 0;
        margin-left: 20px;
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
}
</style>
<style lang="scss">
// 确认执行脚本窗口
.exact-confirm-script-dialog, .confirm-script-dialog {
  h4 {
    font-size: var(--font-size);
    margin-bottom: 15px;
    font-weight: normal;
    padding: 5px 12px;
  }
  .data-source-select {
    margin-bottom: 20px;
  }
  .warning-wrap {
    margin-bottom: 20px;
    border: 2px solid var(--color-danger);
    padding: 15px;
    background-color: #FFE8E6;
    border-radius: 5px;
    color: var(--color-danger);
    p {
      line-height: 40px;
    }
    .confirm-text {
      font-weight: bold;
      color: #333;
      font-size: 16px;
      letter-spacing: 2px;
      word-break: break-all;
      line-height: 20px;
      margin-top: 8px;
      // 调整选中后的颜色
      &::selection {
        background-color: var(--color-danger);
        color: #fff;
      }
    }
  }
  em {
    font-weight: bold;
    font-style: normal;
    color: var(--primary-color-match-2);
  }
  .el-input .el-input__inner{
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 2px;
    &::placeholder {
      font-size: 14px;
      font-weight: normal;
      letter-spacing: initial;
    }
  }
  .error-tip {
    min-height: 20px;
    margin-top: 5px;
    color: var(--color-danger);
  }
  .opera {
    display: flex;
    justify-content: flex-end;
    padding: 20px 0 0 0;
  }
}
.confirm-script-dialog {
  .el-dialog__body {
    padding-top: 10px;
    p {
      line-height: 25px;
    }
  }
}
// 脚本执行失败窗口
.el-dialog.script-error-dialog {
  background-color: var(--color-danger);
  .el-dialog__header {
    .el-dialog__headerbtn {
      top: 2px;
    }
    .el-dialog__title {
      color: #fff;
    }
    .el-dialog__close {
      color: #fff;
    }
  }
  .el-dialog__body {
    background-color: #fff;
    border-top: 1px solid var(--primary-color-match-2-transition);
  }
  pre {
    margin: 0;
  }
}
</style>
