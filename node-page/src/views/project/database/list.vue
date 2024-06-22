<template>
  <div v-if="project != null" class="form">
    <div class="wrap">
      <h2>{{project.name}}项目数据库</h2>
      <FormTip>
        当前数据库信息保存在「<em>{{project.name}}</em>」项目的<em>kit.db.json</em>文件中。
      </FormTip>
      <div class="database-list-wrap">
        <ul class="toolbar">
          <li>
            <el-button type="primary" @click="$refs.operaDataSourceWindow.open(project.id)">{{$t('database.addNewDatabase')}}</el-button>
          </li>
        </ul>
        <ul v-if="databases.length > 0" class="database-list">
          <li v-for="db in databases" :key="db.name">
            <DatabaseView
              :database="db"
              @edit="edit(db)"
              @delete="deleteDatabase(db.id)"
            />
          </li>
        </ul>
        <Empty v-else description="暂无数据库配置"/>
        <Pagination :pagination="pagination"/>
      </div>
    </div>
    <OperaDataSourceWindow :with-tip="false" ref="operaDataSourceWindow" @success="fetchDatabases"/>
  </div>
</template>

<script>
import InnerRouterView from '@/components/common/InnerRouterView/InnerRouterView.vue'
import InnerRouterViewWindow from '@/components/common/InnerRouterView/InnerRouterViewWindow.vue'
import DatabaseView from '@/components/usr/project/DatabaseView.vue'
import Empty from '@/components/common/Empty.vue'
import Pagination from '@/components/common/Pagination.vue'
import OperaDataSourceWindow from '@/components/database/OperaDataSourceWindow.vue'
import FormTip from '@/components/common/FormTip.vue'
import { deleteById, fetchDatabases } from '@/api/project.database'
import { fetchById } from '@/api/project'

export default {
  components: {
    FormTip,
    OperaDataSourceWindow,
    Pagination, Empty, DatabaseView, InnerRouterViewWindow, InnerRouterView
  },
  data () {
    return {
      project: null,
      databases: [],
      pagination: {
        pageIndex: 1,
        capacity: 10,
        total: 0
      }
    }
  },
  methods: {
    // 查询项目信息
    fetchProject () {
      fetchById(this.$route.params.projectId)
        .then(data => {
          this.project = data
          this.fetchDatabases()
        })
        .catch(e => {
          this.$tip.apiFailed('找不到项目信息！')
          this.$routers.push({ name: 'Desktop'})
        })
    },
    // 查询项目数据库
    fetchDatabases () {
      fetchDatabases(this.$route.params.projectId)
        .then(databases => {
          this.databases = databases
        })
        .catch(e => {
          console.error('获取项目数据库失败！', e)
          this.$tip.apiFailed('获取项目数据库失败！')
        })
    },
    // 修改数据库
    edit (db) {
      this.$refs.operaDataSourceWindow.open(this.project.id, db)
    },
    // 删除数据库
    deleteDatabase (id) {
      const database = this.databases.find(db => db.id === id)
      if (database == null) {
        this.$tip.error('未找到数据库信息，请刷新后重试！')
        return
      }
      this.deleteConfirm(`确认删除「${database.name}」数据库吗？`)
        .then(() => {
          deleteById ({
            projectId: this.project.id,
            databaseId: id
          })
            .then(() => {
              this.fetchDatabases()
            })
            .catch(e => {
              this.$tip.apiFailed(e)
            })
        })
        .catch(() => {})
    }
  },
  created () {
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
  // 数据库列表
  .database-list-wrap {
    padding: 0 20px;
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
