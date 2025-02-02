<template>
  <div class="form">
    <div class="wrap">
      <h2>{{$t('service.createService')}}</h2>
      <FormTip v-if="space != null">
        为空间<em>{{space}}</em>创建服务。
      </FormTip>
      <el-form ref="form" :model="form" :rules="getRules()">
        <el-form-item label="服务名称" prop="label" required>
          <el-input ref="labelInput" v-model="form.label" @input="handleLabelInput"/>
          <FormItemTip content="服务名称将展示给使用者，方便使用者更好的理解您的用意。"/>
        </el-form-item>
        <el-form-item label="服务标识符" prop="name" required>
          <el-input class="follow-input" v-model="form.name"/>
          <FormItemTip content="服务标识符会在使用者安装您的服务后记录在项目配置文件中，且标识符在同一个服务空间中是唯一的，一旦确认将不可修改。"/>
        </el-form-item>
      </el-form>
      <div class="opera">
        <el-button type="primary" @click="create">创建服务</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import I18nInput from "@/components/common/I18nInput.vue";
import SpaceSelect from "@/components/space/SpaceSelect.vue";
import CompilerSelect from "@/components/common/CompilerSelect.vue";
import ServiceTypeSelect from "@/components/service/ServiceTypeSelect.vue";
import VersionSelect from "@/components/common/VersionSelect.vue";
import MainServiceSelect from "@/components/service/MainServiceSelect.vue";
import FormItemTip from "@/components/common/FormItemTip.vue";
import { create } from "@/api/user.service";
import {pinyin} from "pinyin-pro";
import FormTip from "../../../components/common/FormTip.vue";

export default {
  components: {
    FormTip,
    FormItemTip,
    MainServiceSelect,
    VersionSelect, ServiceTypeSelect, CompilerSelect, SpaceSelect, I18nInput},
  data () {
    return {
      space: null,
      form: {
        name: '',
        label: ''
      }
    }
  },
  methods: {
    // 处理名称输入
    handleLabelInput (value) {
      this.form.name = pinyin(value, { toneType: 'none', type: 'array' }).map(item => item.substr(0, 1)).join('')
    },
    // 获取表单验证规则
    getRules () {
      return {
        name: [
          { required: true, message: this.$t('form.isRequired', { value: this.$t('service.settings.name') })}
        ],
        label: [
          { required: true, message: this.$t('form.isRequired', { value: this.$t('service.settings.label') })}
        ]
      }
    },
    // 创建服务
    create () {
      this.$refs.form.validate((pass) => {
        if (!pass) {
          return
        }
        create({
          space: this.space,
          ...this.form
        })
          .then(() => {
            this.$router.push({
              name: 'ServiceSettings',
              query: { space: this.space, service: this.form.name }
            })
          })
          .catch(e => {
            this.$tip.apiFailed(e)
          })
      })
    }
  },
  created () {
    this.space = this.$route.query.space
    this.$nextTick(() => {
      setTimeout(() => {
        this.$refs.labelInput.focus()
      }, 100)
    })
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
    margin: 30px auto var(--gap-page-bottom) auto;
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
    margin-top: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
