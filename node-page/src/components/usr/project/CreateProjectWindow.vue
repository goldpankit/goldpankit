<template>
  <el-dialog
    v-model="visible"
    :title="$t('project.createProject')"
    custom-class="create-project-dialog"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <section class="tip">
      {{ $t('project.createTip') }}
    </section>
    <el-form ref="form" :model="form" :rules="getRules()">
      <el-form-item :label="$t('project.name')" prop="name" required>
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item :label="$t('project.codespace')" prop="codespace" required>
        <DirectorySelect v-model="form.codespace"/>
      </el-form-item>
      <el-form-item :label="$t('common.remark')" prop="remark">
        <el-input type="textarea" :rows="5" v-model="form.remark" maxlength="200"/>
      </el-form-item>
    </el-form>
    <div class="opera">
      <el-button size="large" @click="cancelCreate">{{$t('common.cancel')}}</el-button>
      <el-button type="primary" size="large" @click="confirmCreate">{{$t('project.createProject')}}</el-button>
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
    getRules () {
      return {
        name: [
          { required: true, message: this.$t('form.isRequired', { value: this.$t('project.name') })},
        ]
      }
    },
    // 确认创建
    confirmCreate () {
      this.$refs.form.validate()
        .then(() => {
          create({
            ...this.form,
            name: this.form.name.trim()
          })
            .then(data => {
              this.visible = false
              this.$emit('success', data)
            })
            .catch(e => {
              this.$tip.apiFailed(e)
            })
        })
    },
    // 取消创建
    cancelCreate () {
      this.visible = false
    }
  }
}
</script>

<style lang="scss">
.create-project-dialog {
  .el-dialog__title {
    font-size: var(--font-size-large);
    font-weight: bold;
  }
  .el-dialog__body {
    padding: 0;
    // 提示
    & > .tip {
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
    & > .opera {
      display: flex;
      justify-content: flex-end;
      padding: 0 30px 30px 0;
    }
    & > .el-form {
      padding: 0 30px;
    }
  }
}
</style>
