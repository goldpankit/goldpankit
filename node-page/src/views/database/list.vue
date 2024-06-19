<template>
  <div class="form">
    <div class="wrap">
      <h2>数据库</h2>
      <FormTip>
        {{$t('database.tip')}}
      </FormTip>
      <div class="database-list-wrap">
        <ul class="toolbar">
          <li>
            <el-button type="primary" @click="$refs.operaDataSourceWindow.open()">{{$t('database.addNewDatabase')}}</el-button>
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
    <OperaDataSourceWindow ref="operaDataSourceWindow"/>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import InnerRouterView from '@/components/common/InnerRouterView/InnerRouterView'
import InnerRouterViewWindow from '@/components/common/InnerRouterView/InnerRouterViewWindow'
import DatabaseView from '@/components/usr/project/DatabaseView'
import Empty from '@/components/common/Empty'
import Pagination from '@/components/common/Pagination'
import OperaDataSourceWindow from '@/components/database/OperaDataSourceWindow'
import FormTip from '@/components/common/FormTip'
import { deleteById } from '@/api/database'

export default {
  components: {
    FormTip,
    OperaDataSourceWindow,
    Pagination, Empty, DatabaseView, InnerRouterViewWindow, InnerRouterView
  },
  data () {
    return {
      pagination: {
        pageIndex: 1,
        capacity: 10,
        total: 0
      }
    }
  },
  computed: {
    ...mapState(['databases'])
  },
  methods: {
    ...mapActions(['fetchDatabases']),
    // 修改数据库
    edit (db) {
      this.$refs.operaDataSourceWindow.open(db)
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
          deleteById (id)
            .then(() => {
              this.fetchDatabases()
            })
            .catch(e => {
              this.$tip.apiFailed(e)
            })
        })
        .catch(() => {})
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
