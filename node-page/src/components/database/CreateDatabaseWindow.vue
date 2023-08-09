<template>
  <el-dialog
    v-model="visible"
    :title="$t('database.createDatabase')"
    custom-class="create-database-dialog"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form ref="form" :model="form" :rules="getRules()">
      <el-form-item :label="$t('common.name')" prop="name" required>
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item :label="$t('database.databaseType')" prop="type" required>
        <DatabaseTypeSelect v-model="form.type" :multiple="false"/>
      </el-form-item>
      <el-form-item :label="$t('database.host')" prop="host" required>
        <el-input v-model="form.host"/>
      </el-form-item>
      <el-form-item :label="$t('database.port')" prop="port" required>
        <el-input v-model="form.port"/>
      </el-form-item>
      <el-form-item :label="$t('database.schema')" prop="schema" required>
        <el-input v-model="form.schema"/>
      </el-form-item>
      <el-form-item :label="$t('database.username')" prop="username" required>
        <el-input v-model="form.username"/>
      </el-form-item>
      <el-form-item :label="$t('database.password')" prop="password" required>
        <el-input type="password" v-model="form.password" show-password/>
      </el-form-item>
      <el-form-item v-if="form.type === 'mysql'" label="URL" class="item-url">
        <template #label>
          <div>
            <label>URL</label>
            <a href="javascript:;" @click="testConnect">{{$t('database.testConnection')}}</a>
          </div>
        </template>
        <el-input :model-value="url" readonly disabled/>
        <p v-if="connectResult.connecting">{{$t('database.connecting')}}</p>
        <p v-else-if="!connectResult.withError && connectResult.message != null" class="success">{{connectResult.message}}</p>
        <p v-else-if="connectResult.message != null" class="error">{{connectResult.message}}</p>
      </el-form-item>
    </el-form>
    <div class="opera">
      <el-button size="large" @click="cancelCreate">{{$t('common.cancel')}}</el-button>
      <el-button type="primary" size="large" @click="confirmCreate">{{$t('database.createDatabase')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import DatabaseTypeSelect from "./DatabaseTypeSelect.vue";
import {testConnect} from "../../api/database.util";
import {create} from "../../api/database";
import {trim} from "../../utils/util";

export default {
  name: "CreateDatabaseWindow",
  components: {DatabaseTypeSelect},
  data () {
    return {
      visible: false,
      isWorking: false,
      form: {
        name: '',
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        schema: '',
        username: 'root',
        password: '',
        models: []
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
      return `jdbc:mysql://${this.form.host}:${this.form.port}`
    }
  },
  methods: {
    open () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    },
    getRules () {
      return {
        name: [
          { required: true, message: this.$t('form.isRequired', { value: this.$t('common.name') })},
        ]
      }
    },
    // 确认创建
    confirmCreate () {
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
      this.connectResult.withError = false
      // 密码不去空
      const password = this.form.password
      const form = trim(this.form)
      form.password = password
      testConnect({
        host: form.host,
        port: form.port,
        user: form.username,
        password: form.password,
        database: form.schema
      })
        .then(() => {
          this.connectResult.withError = false
          this.connectResult.message = this.$t('database.connectSuccessfully')
        })
        .catch(e => {
          this.connectResult.withError = true
          this.connectResult.message = e.message
        })
        .finally(() => {
          this.connectResult.connecting = false
        })
    }
  }
}
</script>

<style lang="scss">
.create-database-dialog {
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
