<template>
  <div class="form">
    <div class="wrap">
      <h2>Xxx Databases</h2>
      <section class="tip">
        The database information will only be stored on your device.
      </section>
      <InnerRouterViewWindow ref="window" v-model="currentRoute">
        <InnerRouterView name="databaseList" title="Databases" default>
          Database List
          <el-button @click="$refs.window.push('addNewDatabase')"></el-button>
        </InnerRouterView>
        <InnerRouterView name="addNewDatabase" title="Add New Database">
          <el-form>
            <el-form-item label="Name" required>
              <el-input/>
            </el-form-item>
            <el-form-item label="Database Type" required>
              <el-select>
                <el-option value="mysql" label="MySQL"/>
                <el-option value="oracle" label="Oracle"/>
              </el-select>
            </el-form-item>
            <el-form-item label="Host" required>
              <el-input/>
            </el-form-item>
            <el-form-item label="Port" required>
              <el-input/>
            </el-form-item>
            <el-form-item label="Username" required>
              <el-input/>
            </el-form-item>
            <el-form-item label="Password" required>
              <el-input/>
            </el-form-item>
          </el-form>
          <div class="opera">
            <el-button type="primary" size="large" @click="create">Create Project</el-button>
          </div>
        </InnerRouterView>
      </InnerRouterViewWindow>
    </div>
  </div>
</template>

<script>
import {create} from "../../../api/user.project";
import DirectorySelect from "../../../components/common/DirectorySelect.vue";
import InnerRouterView from "../../../components/common/InnerRouterView/InnerRouterView.vue";
import InnerRouterViewWindow from "../../../components/common/InnerRouterView/InnerRouterViewWindow.vue";

export default {
  components: {InnerRouterViewWindow, InnerRouterView, DirectorySelect},
  data () {
    return {
      form: {
        name: '',
        codespace: '',
        remark: ''
      },
      currentRoute: 'databaseList'
    }
  },
  methods: {
    create () {
      create(this.form)
        .then(data => {
          console.log('data', data)
        })
        .catch(e => {
          console.log('e', e)
        })
    }
  }
}
</script>

<style scoped lang="scss">
.form {
  height: 100%;
  overflow-y: auto;
  .wrap {
    width: var(--form-width);
    background-color: var(--color-light);
    margin: 30px auto 60px auto;
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
    margin-top: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
