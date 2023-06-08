<template>
  <el-select
    class="table-select"
    popper-class="table-select__popper"
    :model-value="modelValue"
    @change="handleChange"
  >
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
      <FieldSetting :value-key="valueKey" :table="selected" :group="group"/>
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
    modelValue: {},
    // 值字段
    valueKey: {
      default: 'value'
    },
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
    // 获取表字段变量组，组中包含了表字段的扩展变量
    fieldVariableGroup () {
      return this.variables.filter(v => v.type === 'group' && v.scope === 'table_field')
    }
  },
  methods: {
    handleChange (value) {
      this.selected = this.tables.find(table => table.name === value)
      this.fieldVariableGroup.forEach(group => {
        group[this.valueKey] = []
      })
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
          if (this.modelValue != null) {
            this.selected = this.tables.find(v => v.name === this.modelValue)
          }
        })
        .catch(e => {
          console.log('e', e)
        })
    }
  },
  created () {
    this.fetchTables()
    const json = {
      queryFields: [
        { name: '', type: '',  }
      ]
    }
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
