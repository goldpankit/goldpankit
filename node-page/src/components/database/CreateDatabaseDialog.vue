<template>
  <el-dialog
    custom-class="create-database-dialog"
    v-model="visible"
    width="800px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    destroy-on-close
    title="创建数据库"
    append-to-body
  >
    <p>该操作将使用<em>{{ config.user }}</em>用户在<em>{{ config.host }}:{{config.port}}</em>上通过以下语句创建数据库，您可以直接调整该语句以满足需求：</p>
    <!-- 脚本输入框 -->
    <div class="script-input-container"></div>
    <p>确认使用当前语句创建数据库吗？</p>
    <!-- 错误提示 -->
    <p class="error-tip">{{ error }}</p>
    <div class="opera">
      <!-- 操作按钮 -->
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" @click="copy">复制</el-button>
      <el-button :disabled="isWorking" :loading="isWorking" type="important2" @click="execute">确认创建</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import * as monaco from 'monaco-editor'
import { execSql } from '@/api/database.util'

export default {
  name: 'CreateDatabaseDialog',
  computed: {
    ...mapState(['installData']),
    // 构建列表
    builds () {
      if (this.installData == null) {
        return []
      }
      return this.installData.build.builds
    }
  },
  data () {
    return {
      // 是否展示
      visible: false,
      // 是否正在执行中
      isWorking: false,
      // 错误提示
      error: null,
      // 数据库配置信息
      config: null,
      // 创建脚本
      sql: ''
    }
  },
  methods: {
    // 打开窗口
    open (config, databaseName) {
      this.config = config
      this.sql = `CREATE DATABASE \`${databaseName}\` CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci';`
      this.error = null
      this.isWorking = false
      this.visible = true
      this.$nextTick(() => {
        // 初始化高亮编辑器
        const editor = monaco.editor.create(
            document.querySelector('.create-database-dialog .script-input-container'),
            {
              lineHeight: '30px',
              value: this.sql,
              language: 'sql',
              readOnly: false,
              // 使用数据库主题
              theme: 'vs-light',
              automaticLayout: true,
              lineNumbers: "off",
              minimap: {
                enabled: false
              }
            }
        )
        // - 内容变更后触发v-model修改
        editor.onDidChangeModelContent(e => {
          this.sql = editor.getValue()
        })
      })
    },
    // 复制
    copy () {
      navigator.clipboard.writeText(this.sql)
      this.$tip.apiSuccess('复制成功')
    },
    // 执行脚本
    execute () {
      if (this.isWorking) {
        return
      }
      this.isWorking = true
      execSql({
        config: {
          ...this.config,
          username: this.config.user
        },
        sql: this.sql
      })
        .then(() => {
          this.$tip.apiSuccess('数据库创建成功')
          this.visible = false
        })
        .catch(e => {
          this.error = e.message
        })
        .finally(() => {
          this.isWorking = false
        })
    }
  }
}
</script>

<style lang="scss">
.create-database-dialog {
  .el-dialog__body {
    & > p {
      em {
        font-style: normal;
        font-weight: bold;
        color: var(--color-danger);
        margin: 0 3px;
      }
    }
  }
  // 脚本输入框
  .script-input-container {
    height: 30px;
    margin: 10px 0;
  }
  // 错误提示
  .error-tip {
    margin-top: 5px;
    color: var(--color-danger);
    padding-right: 30px;
    min-height: 20px;
  }
  // 操作
  .opera {
    padding: 10px 0 0 0;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
