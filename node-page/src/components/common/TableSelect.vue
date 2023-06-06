<template>
  <el-select class="table-select" popper-class="table-select__popper" @change="handleChange">
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
  <ul v-if="selected != null" class="field-settings">
    <li>
      <FieldSetting :table="selected"/>
    </li>
    <li>
      <FieldSetting :table="selected"/>
    </li>
  </ul>
</template>

<script>
import {fetchTables} from "../../api/db";
import {mapState} from "vuex";
import FieldSetting from "../service/installer/FieldSetting.vue";

export default {
  name: "TableSelect",
  components: {FieldSetting},
  data () {
    return {
      selected: null,
      tables: []
    }
  },
  computed: {
    ...mapState(['currentProject', 'currentDatabase'])
  },
  methods: {
    handleChange (value) {
      this.selected = this.tables.find(table => table.name === value)
      this.$emit('update:modelValue', value)
      this.$emit('change', value)
    },
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
.field-settings {
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
