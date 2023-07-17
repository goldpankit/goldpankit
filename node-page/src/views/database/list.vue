<template>
  <div class="form">
    <div class="wrap">
      <h2>Databases</h2>
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
            <ul v-if="databases.length > 0" class="database-list">
              <li v-for="db in databases" :key="db.name">
                <DatabaseView
                  :database="db"
                  @edit="edit(db)"
                  @delete="deleteDatabase(db.id)"
                  @connect="connect(db)"
                />
              </li>
            </ul>
            <Empty v-else description="No Databases"/>
          </div>
        </InnerRouterView>
        <InnerRouterView name="operaDatabase" :title="operaDbTitle">
          <OperaDatabaseView
            :database="currentDatabase"
            @success="$refs.window.back()"
          />
        </InnerRouterView>
      </InnerRouterViewWindow>
    </div>
  </div>
</template>

<script>
import InnerRouterView from "@/components/common/InnerRouterView/InnerRouterView.vue";
import InnerRouterViewWindow from "@/components/common/InnerRouterView/InnerRouterViewWindow.vue";
import OperaDatabaseView from "@/components/usr/project/OperaDatabaseView.vue";
import DatabaseView from "@/components/usr/project/DatabaseView.vue";
import {deleteById, search} from "../../api/database";
import Empty from "../../components/common/Empty.vue";

export default {
  components: {Empty, DatabaseView, OperaDatabaseView, InnerRouterViewWindow, InnerRouterView},
  data () {
    return {
      databases: [],
      currentDatabase: null,
      pagination: {
        pageIndex: 1,
        capacity: 10,
        total: 0
      }
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
    // 搜索
    search () {
      search (this.pagination)
        .then(data => {
          this.databases = data.records
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
    deleteDatabase (id) {
      this.$model.deleteConfirm(`Do you want to delete the database?`)
        .then(() => {
          deleteById (id)
            .then(() => {
              this.search()
            })
            .catch(e => {
              console.log('e', e)
            })
        })
        .catch(() => {})
    },
    // 测试连接
    connect (db) {},
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
    this.search()
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
