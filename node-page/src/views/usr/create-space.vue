<template>
  <div class="page">
    <div class="wrap">
      <h2>{{$t('space.createSpace')}}</h2>
      <div class="form-wrap">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item label="Space Name" prop="name" required>
            <template #label>
              <span>{{$t('space.spaceName')}}</span>
              <HelpButton code="space-name"/>
            </template>
            <el-input v-model="form.name" maxlength="20"/>
          </el-form-item>
          <el-form-item :label="$t('space.homePage')" prop="homepage">
            <el-input v-model="form.homepage" />
          </el-form-item>
          <el-form-item :label="$t('space.introduce')" prop="introduce" required>
            <el-input v-model="form.introduce" type="textarea" :rows="3" maxlength="200"/>
          </el-form-item>
          <el-form-item :label="$t('space.otherSettings')" class="item-other-settings">
            <div>
              <el-checkbox v-model="form.withPrivate" :label="$t('space.isPrivateServiceTip')"/>
            </div>
            <div>
              <el-checkbox v-model="form.subServiceReceivable" :label="$t('space.receiveSubServicesTip')"/>
            </div>
          </el-form-item>
        </el-form>
        <el-form ref="descForm" class="description-form" :model="form">
          <el-form-item :label="$t('space.spaceDescriptionLabel')" prop="description" required>
            <MarkdownEditor v-model="form.description" :placeholder="$t('space.spaceDescription')"/>
          </el-form-item>
        </el-form>
      </div>
      <div class="opera">
        <el-button type="primary" size="large" @click="create">{{$t('space.createSpace')}}</el-button>
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
        subServiceReceivable: false,
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
  padding: 30px 0;
  box-sizing: border-box;
  .wrap {
    height: 100%;
    min-height: 600px;
    width: var(--page-width);
    background-color: var(--color-light);
    margin: 0px auto 0px auto;
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
      height: 100%;
      padding: 0 30px;
      border-right: 1px solid var(--border-default-color);
      .item-other-settings {
        .el-form-item__content {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    }
    .description-form {
      width: 100%;
      :deep(.el-form-item) {
        height: 100%;
        .el-form-item__content {
          overflow-y: auto;
        }
      }
      .markdown-editor {
        height: 100%;
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
