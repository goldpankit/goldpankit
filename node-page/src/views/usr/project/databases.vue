<template>
  <div class="form">
    <div class="wrap">
      <h2>Xxx Databases</h2>
      <section class="tip">
        The database information will only be stored on your device.
      </section>
      <InnerRouterViewWindow ref="window">
        <InnerRouterView name="databaseList" default>
          <div class="database-list-wrap">
            <ul class="toolbar">
              <li>
                <el-button type="primary" @click="create">Add New Database</el-button>
              </li>
            </ul>
            <ul class="database-list">
              <li v-for="db in databases" :key="db.name">
                <DatabaseView :database="db" @edit="edit(db)"/>
              </li>
            </ul>
          </div>
        </InnerRouterView>
        <InnerRouterView name="operaDatabase" :title="operaDbTitle">
          <OperaDatabaseView :database="currentDatabase" @success="$refs.window.push('databaseList')"/>
        </InnerRouterView>
      </InnerRouterViewWindow>
    </div>
  </div>
</template>

<script>
import InnerRouterView from "../../../components/common/InnerRouterView/InnerRouterView.vue";
import InnerRouterViewWindow from "../../../components/common/InnerRouterView/InnerRouterViewWindow.vue";
import OperaDatabaseView from "../../../components/usr/project/OperaDatabaseView.vue";
import DatabaseView from "../../../components/usr/project/DatabaseView.vue";

export default {
  components: {DatabaseView, OperaDatabaseView, InnerRouterViewWindow, InnerRouterView},
  data () {
    return {
      currentDatabase: null,
      databases: [
        {
          name: '本地环境',
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: 'local@123'
        }
      ]
    }
  },
  computed: {
    operaDbTitle () {
      if (this.currentDatabase == null) {
        return 'Create New Database'
      }
      return `Edit ${this.currentDatabase.name}`
    }
  },
  methods: {
    create () {
      this.currentDatabase = null
      this.$refs.window.push('operaDatabase')
    },
    edit (db) {
      this.currentDatabase = db
      this.$refs.window.push('operaDatabase')
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
  // 数据库列表
  .database-list-wrap {
    .toolbar {
      display: flex;
      justify-content: flex-end;
      border-bottom: 1px solid var(--border-default-color);
      padding-bottom: 20px;
    }
    .database-list {
      & > li {
        padding: 20px 0;
        border-bottom: 1px solid var(--border-default-color);
        &:last-of-type {
          border-bottom: 0;
        }
      }
    }
  }
  // 表单
  .el-form {
    padding: 0 30px;
  }
}
</style>
