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
  <ul v-if="selected != null && fieldVariableGroup.length > 0" class="field-settings">
    <li v-for="group of fieldVariableGroup" :key="group.label">
      <FieldSetting :table="selected" :variable-setting="group"/>
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
  props: {
    // 变量列表，用于查找表字段变量
    variables: {
      required: true
    }
  },
  data () {
    return {
      selected: null,
      tables: []
    }
  },
  computed: {
    ...mapState(['currentProject', 'currentDatabase']),
    // 获取字段变量组
    fieldVariableGroup () {
      // 自定义表字段变量组
      const groups = this.variables.filter(v => v.type === 'group' && v.scope === 'table_field')
      // 基础组：根变量中的表字段变量
      const basicGroup = {
        label: '基础设置',
        children: this.variables.filter(v => v.scope === 'table_field' &&  v.type === 'variable')
      }
      if (basicGroup.children.length > 0) {
        groups.unshift(basicGroup)
      }
      return groups
    }
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
