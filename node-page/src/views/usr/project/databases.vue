<template>
  <div class="form">
    <div v-if="project != null" class="wrap">
      <h2>Xxx Databases</h2>
      <section class="tip">
        The database information will only be stored on your device.
      </section>
      <InnerRouterViewWindow ref="window">
        <InnerRouterView name="databaseList" default>
          <div class="database-list-wrap">
            <ul class="toolbar">
              <li>
                <el-button type="primary" @click="add">Add New Database</el-button>
              </li>
            </ul>
            <ul class="database-list">
              <li v-for="(db,index) in project.databases" :key="db.name">
                <DatabaseView :database="db" @edit="edit(db)" @delete="deleteDatabase(index)"/>
              </li>
            </ul>
          </div>
        </InnerRouterView>
        <InnerRouterView name="operaDatabase" :title="operaDbTitle">
          <OperaDatabaseView
            :project="project"
            :database="currentDatabase"
            @success="$refs.window.back()"
          />
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
import {fetchConfigById, saveConfig} from "../../../api/user.project";

export default {
  components: {DatabaseView, OperaDatabaseView, InnerRouterViewWindow, InnerRouterView},
  data () {
    return {
      projectId: null,
      project: null,
      currentDatabase: null
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
    // 查询项目
    fetchProject () {
      fetchConfigById(this.projectId)
        .then(data => {
          this.project = {
            ...data,
            databases: data.databases || []
          }
        })
        .catch(e => {
          console.log('e', e)
        })
    },
    // 添加数据库
    add () {
      this.currentDatabase = null
      this.$refs.window.push('operaDatabase')
    },
    // 修改数据库
    edit (db) {
      this.currentDatabase = db
      this.$refs.window.push('operaDatabase')
    },
    // 删除数据库
    deleteDatabase (index) {
      this.project.databases.splice(index, 1)
      this.__save()
    },
    // 保存
    __save () {
      saveConfig({
        id: this.project.id,
        databases: this.project.databases
      })
        .then(() => {
          this.$emit('success')
        })
        .catch(e => {
          console.log('e', e)
        })
    }
  },
  created () {
    this.projectId = this.$route.query.project_id
    this.fetchProject()
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
