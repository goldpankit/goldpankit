<template>
  <el-dialog
    v-model="visible"
    :title="form.id ? $t('database.editDatabase') : $t('database.createDatabase')"
    width="550px"
    custom-class="opera-data-source-dialog"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <FormTip>
      {{$t('database.tip')}}
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
      <el-button size="large" @click="cancelCreate">{{$t('common.cancel')}}</el-button>
      <el-button type="primary" size="large" @click="confirm">{{form.id ? $t('common.confirmUpdate') : $t('common.confirmAdd')}}</el-button>
    </div>
    <!-- 创建数据库窗口 -->
    <CreateDatabaseDialog ref="createDatabaseDialog"/>
  </el-dialog>
</template>

<script>
import DatabaseTypeSelect from './DatabaseTypeSelect'
import FormTip from '@/components/common/FormTip'
import { testConnect, checkDatabaseExists } from '@/api/database.util'
import { create, updateById } from '@/api/database'
import { trim } from '@/utils/util'
import { strictCopy } from '@/utils/object'
import FormItemTip from '@/components/common/FormItemTip'
import CreateDatabaseDialog from "@/components/database/CreateDatabaseDialog.vue";

export default {
  name: "OperaDataSourceWindow",
  components: {CreateDatabaseDialog, FormItemTip, FormTip, DatabaseTypeSelect},
  data () {
    return {
      visible: false,
      isWorking: false,
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
    url () {
      return `jdbc:mysql://${this.form.host}:${this.form.port}/${this.form.schema}`
    }
  },
  methods: {
    // 打开窗口
    open (data) {
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
    },
    // 确认创建
    confirm () {
      this.$refs.form.validate()
        .then(() => {
          if (this.isWorking) {
            return
          }
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
      // 执行创建
      create(form)
        .then(data => {
          this.visible = false
          this.$emit('success', data)
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
        .finally(() => {
          this.isWorking = false
        })
    },
    // 确认修改
    __confirmUpdate (form) {
      // 执行创建
      updateById(form)
        .then(data => {
          this.visible = false
          this.$emit('success', data)
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
        .finally(() => {
          this.isWorking = false
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
    padding: 0;
    & > .opera {
      display: flex;
      justify-content: flex-end;
      padding: 0 30px 30px 0;
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
          width: 120px;
          flex-shrink: 0;
        }
      }
      // 连接地址
      .item-url {
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
          height: 20px;
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
