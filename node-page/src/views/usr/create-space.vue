<template>
  <div class="form">
    <div class="wrap">
      <h2>Create Space</h2>
      <el-form>
        <el-form-item label="Space Name" required>
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="Homepage">
          <el-input v-model="form.homepage" />
        </el-form-item>
        <el-form-item label="Description" required>
          <i18n-input v-model="form.description" type="textarea"/>
        </el-form-item>
      </el-form>
      <div class="opera">
        <el-button type="primary" size="large" @click="create">Create Space</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import I18nInput from '@/components/common/I18nInput.vue'
import { create } from '@/api/service.space'

export default {
  components: {I18nInput},
  data () {
    return {
      form: {
        name: '',
        homepage: '',
        description: ''
      }
    }
  },
  methods: {
    create () {
      create(this.form)
        .then(data => {
          this.$router.push({ name: 'CreateService', query: { space: this.form.name } })
        })
        .catch(e => {
          console.log('e', e)
        })
    }
  }
}
</script>

<style scoped lang="scss">
.form {
  height: 100%;
  overflow-y: auto;
  .wrap {
    width: 500px;
    background-color: var(--color-light);
    margin: 30px auto 60px auto;
    box-shadow: var(--form-shadow);
    padding-bottom: 30px;
  }
  // 标题
  h2 {
    text-align: center;
    padding: 30px 0;
  }
  // 表单
  .el-form {
    padding: 0 30px;
  }
  // 操作
  .opera {
    margin-top: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
