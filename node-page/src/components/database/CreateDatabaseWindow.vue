<template>
  <el-dialog
    v-model="visible"
    title="Create Database"
    custom-class="create-database-dialog"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form ref="form" :model="form">
      <el-form-item label="Name" required>
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item label="Database Type" required>
        <DatabaseTypeSelect v-model="form.type" :multiple="false"/>
      </el-form-item>
      <el-form-item label="Host" required>
        <el-input v-model="form.host"/>
      </el-form-item>
      <el-form-item label="Port" required>
        <el-input v-model="form.port"/>
      </el-form-item>
      <el-form-item label="Schema" required>
        <el-input v-model="form.schema"/>
      </el-form-item>
      <el-form-item label="Username" required>
        <el-input v-model="form.username"/>
      </el-form-item>
      <el-form-item label="Password" required>
        <el-input type="password" v-model="form.password" show-password/>
      </el-form-item>
      <el-form-item v-if="form.type === 'mysql'" label="URL" class="item-url" required>
        <template #label>
          <div>
            <label>URL</label>
            <a href="javascript:;" @click="testConnect">Test Connection</a>
          </div>
        </template>
        <el-input :model-value="url" readonly disabled/>
        <p v-if="connectResult.connecting">连接中</p>
        <p v-else-if="!connectResult.withError && connectResult.message != null" class="success">{{connectResult.message}}</p>
        <p v-else-if="connectResult.message != null" class="error">{{connectResult.message}}</p>
      </el-form-item>
    </el-form>
    <div class="opera">
      <el-button size="large" @click="cancelCreate">Cancel</el-button>
      <el-button type="primary" size="large" @click="confirmCreate">Create Database</el-button>
    </div>
  </el-dialog>
</template>

<script>
import DatabaseTypeSelect from "./DatabaseTypeSelect.vue";
import {testConnect} from "../../api/database.util";
import {create} from "../../api/database";

export default {
  name: "CreateDatabaseWindow",
  components: {DatabaseTypeSelect},
  data () {
    return {
      visible: false,
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
    // 确认创建
    confirmCreate () {
      create(this.form)
        .then(data => {
          this.visible = false
          this.$emit('success', data)
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
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
      testConnect({
        host: this.form.host,
        port: this.form.port,
        user: this.form.username,
        password: this.form.password,
        database: this.form.schema
      })
        .then(() => {
          this.connectResult.withError = false
          this.connectResult.message = 'Succeeded'
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
