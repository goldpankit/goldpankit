<template>
  <el-dialog
    custom-class="sql-preview"
    :title="$t('database.queryResult')"
    width="1000px"
    v-model="visible"
    append-to-body
  >
    <div class="toolbar">
      <el-pagination
        background
        :page-sizes="[10, 20, 50, 100, 200, 500]"
        :default-page-size="100"
        layout="total, prev, pager, next, sizes"
        :total="pagination.total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
    <el-table v-loading="loading" :data="result" border>
      <el-table-column
        v-for="column in columns"
        :key="column"
        :prop="column"
        :label="column"
        :min-width="getColumnWidth(column)"
      />
    </el-table>
  </el-dialog>
</template>

<script>
import {execSql} from "@/api/database.util";
import {mapState} from "vuex";
import {getWidthByLetters} from "@/utils/util";

export default {
  name: "QueryResultPreview",
  data () {
    return {
      loading: false,
      visible: false,
      // 分页数据
      pagination: {
        page: 1,
        capacity: 100,
        total: 0
      },
      // 查询语句
      sql: '',
      // 列
      columns: [],
      // 查询结果
      result: []
    }
  },
  computed: {
    ...mapState(['currentDatabase'])
  },
  methods: {
    open (fields, sql) {
      this.visible = true
      this.loading = true
      this.columns = fields.map(item => item.substring(1, item.length - 1))
      this.result = []
      this.sql = sql
      this.fetchList()
    },
    // 查询数据
    fetchList () {
      execSql({
        database: this.currentDatabase,
        sql: this.__getCountSql()
      })
        .then(result => {
          this.pagination.total = result[0].total
          return execSql({
            database: this.currentDatabase,
            sql: this.__getPaginationSql()
          })
        })
        .then(result => {
          this.result = result
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 获取默认列宽
    getColumnWidth (columnName) {
      // 计算列名占用的宽度
      let columnWidth = getWidthByLetters(columnName) + 24
      // 计算数据占用的宽度
      let valueWidth = columnWidth
      const firstRow = this.result[0]
      if (firstRow != null) {
        const targetValue = firstRow[columnName]
        if (targetValue != null) {
          valueWidth = getWidthByLetters(targetValue) + 24
        }
      }
      // 获取最终宽度（选取最大的宽度）
      return Math.max(columnWidth, valueWidth)
    },
    // 处理分页
    handleCurrentChange (page) {
      this.pagination.page = page
      this.fetchList()
    },
    // 处理修改页容量
    handleSizeChange (size) {
      this.pagination.capacity = size
      this.fetchList()
    },
    // 获取分页语句
    __getPaginationSql () {
      let start = (this.pagination.page - 1) * this.pagination.capacity
      // console.log('execute', `${sql} LIMIT ${start}, ${this.pagination.capacity}`)
      return `${this.sql} LIMIT ${start}, ${this.pagination.capacity}`
    },
    // 获取统计语句
    __getCountSql () {
      return `SELECT COUNT(*) AS total FROM (${this.sql}) _count`
    }
  }
}
</script>

<style lang="scss">
.sql-preview {
  .el-dialog__body {
    padding-top: 0;
  }
  .toolbar {
    padding: 10px 0;
    margin-bottom: 10px;
    border-bottom: 1px solid var(--border-default-color);
    display: flex;
    align-items: center;
    .el-pagination {
      margin-left: 20px;
    }
  }
  .el-table {
    .el-table__cell {
      padding: 0;
      .cell {
        padding: 5px 12px;
      }
    }
  }
}
</style>
