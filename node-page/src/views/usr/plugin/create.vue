<template>
  <div class="form">
    <div class="wrap">
      <h2>{{$t('plugin.create')}}</h2>
      <section class="tip" v-if="service != null">
        <template v-if="$i18n.locale === 'en'">
          {{$t('plugin.createFor')}}<em>{{service}}</em>.
        </template>
        <template v-else>
          {{$t('plugin.createFor1')}}<em>{{service}}</em>{{$t('plugin.createFor2')}}。
        </template>
      </section>
      <el-form ref="form" :model="form" :rules="getRules()">
        <el-form-item :label="$t('plugin.label')" prop="label" required>
          <el-input ref="labelInput" v-model="form.label" @input="handleLabelInput"/>
          <FormItemTip :content="$t('plugin.labelTip')"/>
        </el-form-item>
        <el-form-item :label="$t('plugin.name')" prop="name" required>
          <el-input class="follow-input" v-model="form.name"/>
          <FormItemTip :content="$t('plugin.nameTip')"/>
        </el-form-item>
      </el-form>
      <div class="opera">
        <el-button type="primary" size="large" @click="create">{{$t('plugin.create')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { pinyin } from "pinyin-pro";
import I18nInput from "@/components/common/I18nInput.vue";
import SpaceSelect from "@/components/space/SpaceSelect.vue";
import CompilerSelect from "@/components/common/CompilerSelect.vue";
import ServiceTypeSelect from "@/components/service/ServiceTypeSelect.vue";
import VersionSelect from "@/components/common/VersionSelect.vue";
import MainServiceSelect from "@/components/service/MainServiceSelect.vue";
import FormItemTip from "@/components/common/FormItemTip.vue";
import {create} from "@/api/user.plugin";

export default {
  components: {
    FormItemTip,
    MainServiceSelect,
    VersionSelect, ServiceTypeSelect, CompilerSelect, SpaceSelect, I18nInput},
  data () {
    return {
      space: null,
      service: null,
      form: {
        name: '',
        label: ''
      }
    }
  },
  methods: {
    // 获取表单验证规则
    getRules () {
      return {
        name: [
          { required: true, message: this.$t('form.isRequired', { value: this.$t('plugin.name') })}
        ],
        label: [
          { required: true, message: this.$t('form.isRequired', { value: this.$t('plugin.label') })}
        ]
      }
    },
    // 处理名称输入
    handleLabelInput (value) {
      this.form.name = pinyin(value, { toneType: 'none', type: 'array' }).map(item => item.substr(0, 1)).join('')
    },
    // 创建插件
    create () {
      this.$refs.form.validate((pass) => {
        if (!pass) {
          return
        }
        create({
          space: this.space,
          service: this.service,
          ...this.form
        })
          .then(() => {
            this.$router.push({
              name: 'PluginSettings',
              query: {
                space: this.space,
                service: this.service,
                plugin: this.form.name
              }
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
    this.service = this.$route.query.service
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
  // 提示
  .tip {
    padding: 20px;
    background: var(--background-color-tip);
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
    margin-top: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
