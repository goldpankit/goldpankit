<template>
  <div class="opera-database-view">
    <el-form>
      <el-form-item label="Name" required>
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item label="Database Type" required>
        <el-select v-model="form.type">
          <el-option value="mysql" label="MySQL"/>
          <el-option value="oracle" label="Oracle"/>
        </el-select>
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
        <el-input v-model="form.password"/>
      </el-form-item>
    </el-form>
    <div class="opera">
      <el-button v-if="database == null" type="primary" size="large" @click="save">Add Database</el-button>
      <el-button v-else type="primary" size="large" @click="save">Confirm Update</el-button>
    </div>
  </div>
</template>

<script>
import {saveConfig} from "../../../api/user.project";

export default {
  name: "OperaDatabaseView",
  props: {
    project: {
      required: true
    },
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
      }
    }
  },
  methods: {
    save () {
      if (this.database == null) {
        this.project.databases.unshift(this.form)
      }
      saveConfig({
        id: this.project.id,
        databases: this.project.databases
      })
        .then(() => {
          this.$emit('success')
        })
        .catch(e => {
          console.log('e', e)
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
}
// 操作
.opera {
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
