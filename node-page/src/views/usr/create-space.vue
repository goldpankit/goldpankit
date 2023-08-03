<template>
  <div class="page">
    <div class="wrap">
      <h2>Create Space</h2>
      <div class="form-wrap">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item label="Space Name" prop="name" required>
            <template #label>
              <span>Space Name</span>
              <HelpButton code="space-name"/>
            </template>
            <el-input v-model="form.name" maxlength="20"/>
          </el-form-item>
          <el-form-item label="Private" prop="withPrivate">
            <el-switch v-model="form.withPrivate" />
          </el-form-item>
          <el-form-item label="Homepage" prop="homepage">
            <el-input v-model="form.homepage" />
          </el-form-item>
          <el-form-item label="Introduce" prop="introduce" required>
            <i18n-input v-model="form.introduce" type="textarea" maxlength="200"/>
          </el-form-item>
        </el-form>
        <el-form ref="descForm" class="description-form" :model="form">
          <el-form-item label="Description / Space Readme" prop="description" required>
            <MarkdownEditor v-model="form.description"/>
          </el-form-item>
        </el-form>
      </div>
      <div class="opera">
        <el-button type="primary" size="large" @click="create">Create Space</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import I18nInput from '@/components/common/I18nInput.vue'
import { create } from '@/api/service.space'
import HelpButton from "../../components/common/HelpButton.vue";
import MarkdownEditor from "../../components/common/MarkdownEditor.vue";

export default {
  components: {MarkdownEditor, HelpButton, I18nInput},
  data () {
    return {
      form: {
        name: '',
        withPrivate: false,
        homepage: '',
        introduce: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: 'Please input space name' }
        ],
        introduce: [
          { required: true, message: 'Please input space introduce' }
        ],
        description: [
          { required: true, message: 'Please input space description' }
        ],
      }
    }
  },
  methods: {
    create () {
      this.$refs.form.validate((pass) => {
        if (!pass) {
          return
        }
        if (this.form.description.trim() === '') {
          this.$tip.warning('Please input space description')
          return
        }
        create(this.form)
          .then(() => {
            this.$router.push({ name: 'CreateService', query: { space: this.form.name } })
          })
          .catch(e => {
            this.$tip.apiFailed(e)
          })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.page {
  height: 100%;
  overflow-y: auto;
  .wrap {
    width: var(--page-width);
    background-color: var(--color-light);
    margin: 30px auto 60px auto;
    box-shadow: var(--form-shadow);
    padding-bottom: 30px;
    display: flex;
    flex-direction: column;
  }
  // 标题
  h2 {
    flex-shrink: 0;
    text-align: center;
    padding: 30px 0;
  }
  .form-wrap {
    flex-grow: 1;
    overflow: hidden;
    display: flex;
    .el-form {
      width: 450px;
      height: 500px;
      padding: 0 30px;
      border-right: 1px solid var(--border-default-color);
    }
    .description-form {
      width: 100%;
      .markdown-editor {
        height: 500px;
      }
    }
  }
  // 操作
  .opera {
    border-top: 1px solid var(--border-default-color);
    padding-top: 20px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
