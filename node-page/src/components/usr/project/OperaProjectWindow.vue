<template>
  <el-dialog
    v-model="visible"
    :title="form.id ? $t('project.editProject') : $t('project.createProject')"
    custom-class="create-project-dialog"
    append-to-body
    width="800px"
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
        <DirectorySelect v-if="ready" v-model="form.codespace"/>
      </el-form-item>
      <el-form-item :label="$t('common.remark')" prop="remark">
        <el-input type="textarea" :rows="5" v-model="form.remark" maxlength="200"/>
      </el-form-item>
    </el-form>
    <div class="opera">
      <el-button size="large" @click="cancelCreate">{{$t('common.cancel')}}</el-button>
      <el-button type="primary" size="large" @click="confirm">{{form.id ? $t('common.confirmUpdate') : $t('common.confirmCreate')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import DirectorySelect from "../../common/DirectorySelect.vue";
import {create, save} from "../../../api/user.project";
import {strictCopy} from "../../../utils/object";

export default {
  name: "OperaProjectWindow",
  components: {DirectorySelect},
  data () {
    return {
      visible: false,
      // 数据是否准备完成，准备完成后再展示目录选择，避免codespace获取不到
      ready: false,
      isWorking: false,
      form: {
        id: null,
        name: '',
        codespace: '',
        remark: ''
      }
    }
  },
  methods: {
    open (data) {
      this.ready = false
      this.visible = true
      this.$nextTick(() => {
        this.$refs.form.resetFields()
        this.form.id = null
        // 编辑
        if (data != null) {
          this.form = strictCopy(this.form, data)
        }
        this.ready = true
        // 清理验证
        setTimeout(() => {
          for (const key in this.form) {
            this.$refs.form.clearValidate(key)
          }
        }, 0)
      })
    },
    getRules () {
      return {
        name: [
          { required: true, message: this.$t('form.isRequired', { value: this.$t('project.name') })},
        ],
        codespace: [
          { required: true, message: this.$t('form.isSelectRequired', { value: this.$t('project.codespace') })},
        ],
      }
    },
    // 确认创建
    confirm () {
      this.$refs.form.validate()
        .then(() => {
          if (this.form.id != null) {
            this.__confirmUpdate()
            return
          }
          this.__confirmCreate()
        })
    },
    // 取消创建
    cancelCreate () {
      this.visible = false
    },
    // 确认新建
    __confirmCreate () {
      if (this.isWorking) {
        return
      }
      this.isWorking = true
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
        .finally(() => {
          this.isWorking = false
        })
    },
    // 确认修改
    __confirmUpdate () {
      if (this.isWorking) {
        return
      }
      this.isWorking = true
      save({
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
        .finally(() => {
          this.isWorking = false
        })
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
      .codespace-item {
        .el-form-item__error {
          margin-top: 5px;
        }
      }
    }
  }
}
</style>