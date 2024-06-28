<template>
  <el-dialog
    v-model="visible"
    :title="form.id ? $t('database.editDatabase') : $t('database.createDatabase')"
    width="550px"
    class="opera-data-source-dialog"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <FormTip v-if="project != null && withTip">
      数据库信息仅保存在「<em>{{project.name}}</em>」项目的<em>kit.db.json</em>文件中，请放心填写！
    </FormTip>
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="数据库名称" prop="name" required>
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item label="数据库类型" prop="type" required>
        <DatabaseTypeSelect v-model="form.type" :multiple="false"/>
      </el-form-item>
      <el-form-item label="Host" prop="host" required>
        <el-input v-model="form.host"/>
      </el-form-item>
      <el-form-item label="端口号" prop="port" required>
        <el-input v-model="form.port"/>
      </el-form-item>
      <el-form-item label="用户名" prop="username" required>
        <el-input v-model="form.username"/>
      </el-form-item>
      <el-form-item label="密码" prop="password" required>
        <el-input type="password" v-model="form.password" show-password/>
      </el-form-item>
      <el-form-item label="数据库名称" prop="schema" required>
        <div class="database-input">
          <el-input v-model="form.schema"/>
          <el-button type="primary" @click="openCreateDatabaseDialog">创建该库</el-button>
        </div>
      </el-form-item>
      <el-form-item v-if="form.type === 'mysql'" label="URL" class="item-url">
        <template #label>
          <div>
            <label>URL</label>
            <a href="javascript:;" @click="testConnect">测试连接</a>
          </div>
        </template>
        <el-input :model-value="url" readonly disabled/>
        <p v-if="connectResult.connecting">{{$t('database.connecting')}}</p>
        <p v-else-if="!connectResult.withError && connectResult.message != null" class="success">{{connectResult.message}}</p>
        <p v-else-if="connectResult.message != null" class="error">{{connectResult.message}}</p>
        <p v-else></p>
      </el-form-item>
    </el-form>
    <div class="opera">
      <el-button  :disabled="isWorking" @click="cancelCreate">取消</el-button>
      <el-button type="primary" @click="confirm" :disabled="isWorking">{{ form.id ? '确认修改' : '确认添加' }}</el-button>
    </div>
    <!-- 创建数据库窗口 -->
    <CreateDatabaseDialog ref="createDatabaseDialog"/>
  </el-dialog>
</template>

<script>
import {mapActions, mapMutations, mapState} from 'vuex'
import DatabaseTypeSelect from './DatabaseTypeSelect'
import FormTip from '@/components/common/FormTip'
import FormItemTip from '@/components/common/FormItemTip'
import CreateDatabaseDialog from '@/components/database/CreateDatabaseDialog'
import { testConnect, checkDatabaseExists } from '@/api/database.util'
import { trim } from '@/utils/util'
import { strictCopy } from '@/utils/object'
import { create, updateById } from '@/api/project.database'
import { fetchById } from '@/api/project'

export default {
  name: "OperaDataSourceWindow",
  components: {CreateDatabaseDialog, FormItemTip, FormTip, DatabaseTypeSelect},
  props: {
    // 是否显示顶部提示
    withTip: {
      default: true
    }
  },
  data () {
    return {
      visible: false,
      isWorking: false,
      project: null,
      form: {
        id: null,
        name: '',
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        schema: '',
        username: 'root',
        password: '',
        models: []
      },
      rules: {
        name: [
          { required: true, message: '请输入数据库名称' }
        ],
        type: [
          { required: true, message: '请选择数据库类型' }
        ],
        host: [
          { required: true, message: '请输入Host' }
        ],
        port: [
          { required: true, message: '请输入端口号' }
        ],
        schema: [
          { required: true, message: '请输入数据库名称'},
          { pattern: /^[a-zA-Z0-9_]+$/, message: '数据库名称只能包含字母、数字和下划线', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户名' }
        ],
        password: [
          { required: true, message: '请输入密码' }
        ]
      },
      connectResult: {
        connecting: false,
        message: null,
        withError: false
      }
    }
  },
  computed: {
    ...mapState(['currentProject', 'currentProjectDetail']),
    url () {
      return `jdbc:mysql://${this.form.host}:${this.form.port}/${this.form.schema}`
    }
  },
  methods: {
    ...mapMutations(['setCurrentDatabase']),
    ...mapActions(['fetchDatabases']),
    // 打开窗口
    open (projectId, data) {
      fetchById(projectId)
        .then(project => {
          this.project = project
          this.visible = true
          this.connectResult = {
            connecting: false,
            message: null,
            withError: false
          }
          this.$nextTick(() => {
            this.$refs.form.resetFields()
            this.form.id = null
            // 编辑
            if (data != null) {
              this.form = strictCopy(this.form, data)
            }
            // 清理验证
            setTimeout(() => {
              for (const key in this.form) {
                this.$refs.form.clearValidate(key)
              }
            }, 0)
          })
        })
        .catch(e => {
          this.$tip.apiFailed('找不到项目信息！')
        })
    },
    // 确认创建
    confirm () {
      if (this.isWorking) {
        return
      }
      this.$refs.form.validate()
        .then(() => {
          this.isWorking = true
          // 密码不去空
          const password = this.form.password
          const form = trim(this.form)
          form.password = password
          // 执行创建
          if (form.id == null) {
            this.__confirmCreate(form)
            return
          }
          this.__confirmUpdate(form)
        })
        .catch(() => {})
    },
    // 取消创建
    cancelCreate () {
      this.visible = false
    },
    // 测试连接
    testConnect () {
      if (this.connectResult.connecting) {
        return
      }
      this.connectResult.connecting = true
      this.connectResult.message = null
      this.connectResult.withError = false
      // 密码不去空
      const password = this.form.password
      const form = trim(this.form)
      form.password = password
      // 数据连接配置
      const connConfig = {
        host: form.host,
        port: form.port,
        user: form.username,
        password: form.password
      }
      testConnect(connConfig)
        .then(() => {
          // 验证数据库是否存在
          checkDatabaseExists({
            config: connConfig,
            database: form.schema
          })
            .then(alreadyExists => {
              if (alreadyExists) {
                this.connectResult.withError = false
                this.connectResult.message = '连接成功'
                return
              }
              throw new Error(`数据库 ${form.schema} 不存在`)
            })
            .catch(e => {
              this.connectResult.withError = true
              this.connectResult.message = e.message
            })
        })
        .catch(e => {
          this.connectResult.withError = true
          this.connectResult.message = e.message
        })
        .finally(() => {
          this.connectResult.connecting = false
        })
    },
    // 打开创建数据库窗口
    openCreateDatabaseDialog () {
      this.$refs.form.validate()
        .then(() => {
          // 密码不去空
          const password = this.form.password
          const form = trim(this.form)
          form.password = password
          // 打开窗口
          this.$refs.createDatabaseDialog.open({
            host: form.host,
            port: form.port,
            user: form.username,
            password: form.password
          }, form.schema)
        })
        .catch(() => {})
    },
    // 确认创建
    __confirmCreate (form) {
      create({
        projectId: this.project.id,
        database: form
      })
        .then(data => {
          // 查询最新的数据库
          return this.fetchDatabases()
            .then(() => {
              this.visible = false
              this.$emit('create:completed', data)
              this.$emit('success', data)
              setTimeout(() => {
                this.isWorking = false
              }, 300)
            })
            .catch(e => {
              this.isWorking = false
              this.$tip.apiFailed(e)
            })
        })
        .catch(e => {
          this.isWorking = false
          this.$tip.apiFailed(e)
        })
    },
    // 确认修改
    __confirmUpdate (form) {
      updateById({
        projectId: this.project.id,
        database: form
      })
        .then(data => {
          // 获取数据库成功后再触发成功事件，避免修改成功后使用了旧的数据库信息重新连接（设计模型=>选择一个错误的数据库=>修改成正确的数据库信=>确认编辑=>获取表记录）
          this.fetchDatabases()
            .then(() => {
              this.visible = false
              setTimeout(() => {
                this.isWorking = false
              }, 300)
              this.$emit('success', data)
            })
            .catch(e => {
              this.isWorking = false
              this.$tip.apiFailed(e)
            })
        })
        .catch(e => {
          this.isWorking = false
          this.$tip.apiFailed(e)
        })
    }
  }
}
</script>

<style lang="scss">
.opera-data-source-dialog {
  .el-dialog__title {
    font-size: var(--font-size-large);
    font-weight: bold;
  }
  .el-dialog__body {
    padding: 0 !important;
    & > .opera {
      display: flex;
      justify-content: flex-end;
      padding: 10px 30px 30px 0;
    }
    & > .el-form {
      padding: 0 30px;
      // 数据库名称输入
      .database-input {
        display: flex;
        width: 100%;
        .el-input {
          flex-grow: 1;
        }
        .el-button {
          margin-left: 10px;
          width: 80px;
          flex-shrink: 0;
        }
      }
      // 连接地址
      .item-url {
        margin-bottom: 0;
        .el-form-item__label {
          padding-right: 0;
          & > div {
            width: 100%;
            display: flex;
            justify-content: space-between;
            a {
              color: var(--primary-color-common) !important;
            }
          }
        }
        p {
          width: 100%;
          min-height: 20px;
          line-height: 20px;
          margin-top: 10px;
        }
        .success {
          color: var(--color-success);
        }
        .error {
          color: var(--color-danger);
        }
      }
    }
  }
}
</style>
