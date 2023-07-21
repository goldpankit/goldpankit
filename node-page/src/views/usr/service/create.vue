<template>
  <div class="form">
    <div class="wrap">
      <h2>Create Service</h2>
      <section class="tip" v-if="space != null">
        Create Service for <em>{{space}}</em>.
      </section>
      <el-form>
        <el-form-item label="Service Name" required>
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="Service Type" required>
          <ServiceTypeSelect v-model="form.type"/>
        </el-form-item>
        <!-- 为子服务时需选择跟随服务 -->
        <template v-if="form.type !== 'MAIN'">
          <el-form-item label="Main Service" required>
            <MainServiceSelect v-model="form.mainServiceName" :space="space" />
          </el-form-item>
        </template>
<!--        <el-form-item label="Repository">-->
<!--          <el-input v-model="form.repository"/>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="Introduce" required>-->
<!--          <I18nInput type="textarea" v-model="form.introduce"/>-->
<!--        </el-form-item>-->
      </el-form>
      <div class="opera">
        <el-button type="primary" size="large" @click="create">Create Service</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import I18nInput from "../../../components/common/I18nInput.vue";
import SpaceSelect from "../../../components/space/SpaceSelect.vue";
import CompilerSelect from "../../../components/common/CompilerSelect.vue";
import ServiceTypeSelect from "../../../components/service/ServiceTypeSelect.vue";
import DatabaseSelect from "../../../components/database/DatabaseSelect.vue";
import VersionSelect from "../../../components/common/VersionSelect.vue";
import MainServiceSelect from "../../../components/service/MainServiceSelect.vue";
import { create } from "../../../api/service";

export default {
  components: {
    MainServiceSelect,
    VersionSelect, DatabaseSelect, ServiceTypeSelect, CompilerSelect, SpaceSelect, I18nInput},
  data () {
    return {
      space: null,
      form: {
        name: '',
        type: 'MAIN',
        mainServiceName: null,
        repository: '',
        introduce: ''
      }
    }
  },
  methods: {
    // 创建服务
    create () {
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
          console.log('e', e)
        })
    }
  },
  created () {
    this.space = this.$route.query.space
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
