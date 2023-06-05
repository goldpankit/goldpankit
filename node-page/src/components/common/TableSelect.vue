<template>
  <el-select class="table-select" popper-class="table-select__popper">
    <el-option
      v-for="table in tables"
      :key="table.name"
      :value="table.name"
      :label="table.name"
    >
      <p class="option-content">
        <span>{{ table.name }}</span>
        <span class="text-info-1">{{ table.comment }}</span>
      </p>
    </el-option>
  </el-select>
</template>

<script>
import {fetchTables} from "../../api/db";
import {mapState} from "vuex";

export default {
  name: "TableSelect",
  data () {
    return {
      tables: []
    }
  },
  computed: {
    ...mapState(['currentProject', 'currentDatabase'])
  },
  methods: {
    // 查询表
    fetchTables () {
      const database = this.currentProject.databases.find(db => db.name === this.currentDatabase)
      if (database == null) {
        return
      }
      fetchTables({
        host: database.host,
        port: database.port,
        user: database.username,
        password: database.password,
        database: database.schema
      })
        .then(tables => {
          this.tables = tables
        })
        .catch(e => {
          console.log('e', e)
        })
    }
  },
  created () {
    this.fetchTables()
  }
}
</script>

<style scoped lang="scss">
.table-select {
  width: 100%;
}
</style>
<style lang="scss">
.table-select__popper {
  .option-content {
    display: flex;
    justify-content: space-between;
  }
}
</style>
