<template>
  <div class="opera-database-view">
    <el-form>
      <el-form-item label="Name" required>
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item label="Database Type" required>
        <DatabaseSelect v-model="form.type" :multiple="false"/>
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
      <el-button v-if="database == null" type="primary" size="large" @click="create">Add Database</el-button>
      <el-button v-else type="primary" size="large" @click="update">Confirm Update</el-button>
    </div>
  </div>
</template>

<script>
import {create, updateById} from "../../../api/database";
import {testConnect} from "../../../api/database.util";
import DatabaseSelect from "../../database/DatabaseSelect.vue";

export default {
  name: "OperaDatabaseView",
  components: {DatabaseSelect},
  props: {
    database: {}
  },
  data () {
    const _this = this
    return {
      form: _this.database || {
        name: '',
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        schema: '',
        username: 'root',
        password: ''
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
    // 创建
    create () {
      create(this.form)
        .then(() => {
          this.$emit('success')
        })
        .catch(e => {
          console.log('e', e)
        })
    },
    // 更新
    update () {
      updateById(this.form)
        .then(() => {
          this.$emit('success')
        })
        .catch(e => {
          console.log('e', e)
        })
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

<style scoped lang="scss">
.opera-database-view {
  width: 500px;
  padding: var(--gap-page-padding) 0;
  margin: 0 auto;
  :deep(.el-form) {
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
// 操作
.opera {
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
