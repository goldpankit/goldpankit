<template>
  <div class="form">
    <div class="wrap">
      <h2>Create Project</h2>
      <section class="tip">
        You are now creating an offline project.
      </section>
      <el-form>
        <el-form-item label="Name" required>
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="Code space" required>
          <DirectorySelect v-model="form.codespace"/>
        </el-form-item>
        <el-form-item label="Remark">
          <el-input type="textarea" :rows="5" v-model="form.remark"/>
        </el-form-item>
      </el-form>
      <div class="opera">
        <el-button type="primary" @click="create">Create Project</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {create} from "../../api/project";
import DirectorySelect from "../../components/common/DirectorySelect.vue";

export default {
  components: {DirectorySelect},
  data () {
    return {
      form: {
        name: '',
        codespace: '',
        remark: '',
        databases: []
      }
    }
  },
  methods: {
    create () {
      create(this.form)
        .then(data => {
        })
        .catch(e => {
          this.$tip.apiFailed(e)
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
    width: 800px;
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
  // 提示
  .tip {
    padding: 20px;
    background: var(--primary-color-match-2);
    color: var(--color-light);
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    em {
      background: rgba(0, 0, 0, .15);
      padding: 3px 5px;
      border-radius: 5px;
      font-style: normal;
      font-weight: bold;
      margin: 0 5px;
    }
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
