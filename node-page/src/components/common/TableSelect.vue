<template>
  <el-select class="table-select">
    <el-option
      v-for="table in tables"
      :key="table.name"
      :value="table.name"
      :label="table.name"
    />
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
      fetchTables(database)
        .then(tables => {
          console.log(tables)
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

<style scoped>

</style>
