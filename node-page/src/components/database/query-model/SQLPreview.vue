<template>
  <el-dialog
    custom-class="sql-preview"
    title="Query Result"
    v-model="visible"
    append-to-body
  >
    <el-table :data="result">
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
      visible: false,
      result: []
    }
  },
  computed: {
    columns () {
      if (this.result.length === 0) {
        return []
      }
      const keys = []
      for (const key in this.result[0]) {
        keys.push(key)
      }
      return keys
    },
    rows () {
      return this.result
      // const rows = []
      // for (const row of this.result) {
      //   const newRow = {}
      //   for (const column of this.columns) {
      //     newRow[column] = row[column]
      //   }
      //   rows.push(newRow)
      // }
      // return rows
    }
  },
  methods: {
    open (result) {
      console.log('open')
      this.visible = true
      this.result = result
    },
    getColumnWidth (columnName) {
      console.log(columnName.length * 10)
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
