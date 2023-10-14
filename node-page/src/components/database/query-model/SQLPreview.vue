<template>
  <el-dialog
    custom-class="sql-preview"
    :title="$t('database.queryResult')"
    width="1000px"
    v-model="visible"
    append-to-body
  >
    <el-table v-loading="loading" :data="rows">
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

export default {
  name: "SQLPreview",
  data () {
    return {
      loading: false,
      visible: false,
      columns: [],
      rows: []
    }
  },
  methods: {
    open (fields) {
      this.visible = true
      this.loading = true
      this.$nextTick(() => {
        this.columns = fields.map(item => item.substring(1, item.length - 1))
        this.rows = []
      })
    },
    result (rows) {
      this.rows = rows
      this.loading = false
    },
    getColumnWidth (columnName) {
      return columnName.length * 15
    }
  }
}
</script>

<style lang="scss">
.sql-preview {
  .el-table {
    .el-table__cell {
      padding: 0;
      .cell {
        padding: 0 !important;
      }
    }
  }
}
</style>
