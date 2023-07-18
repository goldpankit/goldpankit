<template>
  <el-dialog
    v-model="visible"
    title="Create Project"
    custom-class="create-project-dialog"
    append-to-body
  >
    <section class="tip">
      You are now creating an offline project.
    </section>
    <el-form ref="form" :model="form">
      <el-form-item label="Name" prop="name" required>
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item label="Code space" prop="codespace" required>
        <DirectorySelect v-model="form.codespace"/>
      </el-form-item>
      <el-form-item label="Remark" prop="remark">
        <el-input type="textarea" :rows="5" v-model="form.remark"/>
      </el-form-item>
    </el-form>
    <div class="opera">
      <el-button type="primary" size="large" @click="confirmCreateProject">Create Project</el-button>
    </div>
  </el-dialog>
</template>

<script>
import DirectorySelect from "../../common/DirectorySelect.vue";
import {create} from "../../../api/user.project";

export default {
  name: "CreateProjectWindow",
  components: {DirectorySelect},
  data () {
    return {
      visible: false,
      form: {
        name: '',
        codespace: '',
        remark: ''
      }
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
    confirmCreateProject () {
      create(this.form)
        .then(data => {
          this.visible = false
          this.$emit('success', data)
        })
        .catch(e => {
          console.log('e', e)
        })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
