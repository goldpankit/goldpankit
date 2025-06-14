<template>
  <div class="page">
    <div class="wrap">
      <h2>创建项目空间</h2>
      <div class="form-wrap">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item label="项目标识符" prop="name" required>
            <el-input v-model="form.name" placeholder="请输入项目标识符"/>
          </el-form-item>
          <el-form-item label="项目名称" prop="label" required>
            <el-input v-model="form.label" placeholder="请输入项目名称"/>
          </el-form-item>
          <el-form-item label="技术文档" prop="techDocUrl">
            <el-input v-model="form.techDocUrl" placeholder="请输入项目技术文档地址"/>
          </el-form-item>
          <el-form-item :label="$t('space.otherSettings')" class="item-other-settings">
            <div>
              <el-checkbox v-model="form.withPrivate" label="这是一个私有项目"/>
            </div>
<!--            <div>-->
<!--              <el-checkbox v-model="form.subServiceReceivable" :label="$t('space.receiveSubServicesTip')"/>-->
<!--            </div>-->
          </el-form-item>
        </el-form>
        <el-form ref="descForm" class="description-form" :model="form">
          <el-form-item label="项目描述" prop="description">
            <MarkdownEditor v-model="form.description" placeholder="请撰写项目描述"/>
          </el-form-item>
        </el-form>
      </div>
      <div class="opera">
        <el-button type="primary" @click="create">{{$t('space.createSpace')}}</el-button>
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
        label: '',
        techDocUrl: '',
        withPrivate: false,
        subServiceReceivable: false,
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入项目唯一标识符' }
        ],
        label: [
          { required: true, message: '请输入项目名称' }
        ]
      }
    }
  },
  methods: {
    create () {
      this.$refs.form.validate((pass) => {
        if (!pass) {
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
