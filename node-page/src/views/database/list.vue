<template>
  <div class="form">
    <div class="wrap">
      <h2>{{$t('database.databases')}}</h2>
      <section class="tip">
        {{$t('database.tip')}}
      </section>
      <div class="database-list-wrap">
        <ul class="toolbar">
          <li>
            <el-button type="primary" @click="$refs.operaDatabaseWindow.open()">{{$t('database.addNewDatabase')}}</el-button>
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
        <Empty v-else description="No Databases"/>
        <Pagination :pagination="pagination"/>
      </div>
    </div>
    <CreateDatabaseWindow ref="operaDatabaseWindow" @success="search"/>
  </div>
</template>

<script>
import InnerRouterView from "@/components/common/InnerRouterView/InnerRouterView.vue";
import InnerRouterViewWindow from "@/components/common/InnerRouterView/InnerRouterViewWindow.vue";
import DatabaseView from "@/components/usr/project/DatabaseView.vue";
import {deleteById, search} from "../../api/database";
import Empty from "../../components/common/Empty.vue";
import Pagination from "../../components/common/Pagination.vue";
import CreateDatabaseWindow from "../../components/database/CreateDatabaseWindow.vue";

export default {
  components: {
    CreateDatabaseWindow,
    Pagination, Empty, DatabaseView, InnerRouterViewWindow, InnerRouterView},
  data () {
    return {
      databases: [],
      pagination: {
        pageIndex: 1,
        capacity: 10,
        total: 0
      }
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
          this.$tip.apiFailed(e)
        })
    },
    // 修改数据库
    edit (db) {
      this.$refs.window.push('operaDatabase')
    },
    // 删除数据库
    deleteDatabase (id) {
      this.deleteConfirm(`Do you want to delete the database?`)
        .then(() => {
          deleteById (id)
            .then(() => {
              this.search()
            })
            .catch(e => {
              this.$tip.apiFailed(e)
            })
        })
        .catch(() => {})
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
