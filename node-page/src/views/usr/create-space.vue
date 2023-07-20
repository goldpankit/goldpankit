<template>
  <div class="page">
    <div class="wrap">
      <h2>Create Space</h2>
      <div class="form-wrap">
        <el-form :model="form">
        <el-form-item label="Space Name" required>
          <template #label>
            <span>Space Name</span>
            <HelpButton code="space-name"/>
          </template>
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="Private">
          <el-switch v-model="form.withPrivate" />
        </el-form-item>
        <el-form-item label="Homepage">
          <el-input v-model="form.homepage" />
        </el-form-item>
        <el-form-item label="Introduce" required>
          <i18n-input v-model="form.introduce" type="textarea" maxlength="200"/>
        </el-form-item>
      </el-form>
        <el-form class="description-form" :model="form">
          <el-form-item label="Description" required>
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
