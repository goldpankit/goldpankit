<template>
  <div class="space-settings">
    <div v-loading="loading" class="form-wrap">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item :label="$t('space.spaceName')" prop="name">
          <h3>{{form.name}}</h3>
        </el-form-item>
        <el-form-item :label="$t('space.homePage')" prop="homepage">
          <el-input v-model="form.homepage" />
        </el-form-item>
        <el-form-item :label="$t('space.otherSettings')" class="item-other-settings">
          <div>
            <el-checkbox v-model="form.withPrivate" :label="$t('space.isPrivateServiceTip')"/>
          </div>
<!--          <div>-->
<!--            <el-checkbox v-model="form.subServiceReceivable" :label="$t('space.receiveSubServicesTip')"/>-->
<!--          </div>-->
        </el-form-item>
      </el-form>
      <el-form ref="descForm" class="description-form" :model="form">
        <el-form-item :label="$t('space.spaceDescriptionLabel')" prop="description" required>
          <MarkdownEditor v-model="form.description" :placeholder="$t('space.spaceDescription')"/>
        </el-form-item>
      </el-form>
    </div>
    <div class="opera">
      <el-button type="primary" :disabled="isWorking" @click="save">{{$t('common.save')}}</el-button>
    </div>
  </div>
</template>

<script>
import HelpButton from "../../common/HelpButton.vue";
import MarkdownEditor from "../../common/MarkdownEditor.vue";
import {fetchProfileByName, save} from "../../../api/service.space";

export default {
  name: "SpaceSettings",
  components: {MarkdownEditor, HelpButton},
  props: {
    // 空间名称
    space: {
      required: true
    }
  },
  data () {
    return {
      loading: false,
      isWorking: false,
      form: {
        id: null,
        name: '',
        withPrivate: false,
        subServiceReceivable: false,
        homepage: '',
        introduce: '',
        description: ''
      },
      rules: {
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
    // 查询空间信息
    fetchSpace () {
      if (this.loading) {
        return
      }
      this.loading = true
      fetchProfileByName(this.space)
        .then(data => {
          for (const key in this.form) {
            this.form[key] = data[key]
          }
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 保存空间信息
    save () {
      this.$refs.form.validate()
        .then(() => {
          if (this.isWorking) {
            return
          }
          this.isWorking = true
          save(this.form)
            .then(() => {
              this.$tip.success(this.$t('common.saveSuccessfully'))
            })
            .catch(e => {
              this.$tip.apiFailed(e)
            })
            .finally(() => {
              this.isWorking = false
            })
        })
        .catch(() => {})
    }
  },
  created () {
    this.fetchSpace()
  }
}
</script>

<style scoped lang="scss">
.space-settings {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
}
.form-wrap {
  flex-grow: 1;
  overflow: hidden;
  display: flex;
  .el-form {
    width: 450px;
    height: 100%;
    padding: 10px 30px;
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
</style>
