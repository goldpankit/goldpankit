<template>
  <el-select
    class="table-select"
    popper-class="table-select__popper"
    :model-value="modelValue"
    clearable
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
      <FieldSetting :value-key="valueKey" :table="selected" :group="group" @change="emitChange"/>
    </li>
  </ul>
</template>

<script>
import {mapState} from "vuex";
import FieldSetting from "../service/installer/FieldSetting.vue";
import {fetchTables} from "@/api/database.util";
import {search} from "../../api/database";
import {getDefaultEmptyValue, isEmptyValue} from "../../utils/variable";

export default {
  name: "TableSelect",
  components: {FieldSetting},
  props: {
    modelValue: {},
    // 值字段
    valueKey: {
      default: 'value'
    },
    // 当前变量
    variable: {
      required: true
    }
  },
  data () {
    return {
      selected: null,
      databases: [],
      tables: []
    }
  },
  computed: {
    ...mapState(['currentProject', 'currentDatabase']),
    // 获取表字段变量组，组中包含了表字段的扩展变量
    fieldVariableGroup () {
      return this.variable.children || []
    }
  },
  watch: {
    currentDatabase () {
      this.fetchTables()
    }
  },
  methods: {
    // 切换表选择
    handleChange (value) {
      this.selected = this.tables.find(table => table.name === value)
      // 清空表字段变量组的值（可能是默认值，取决于valueKey属性）
      this.fieldVariableGroup.forEach(group => {
        group[this.valueKey] = []
      })
      this.$emit('update:modelValue', value)
      this.$emit('change', value)
    },
    emitChange () {
      this.$emit('change')
    },
    // 查询库
    fetchDatabases () {
      search ()
        .then(data => {
          this.databases = data
          this.fetchTables()
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 查询表
    fetchTables () {
      const database = this.databases.find(db => db.id === this.currentDatabase)
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
          // 填充默认选中的table
          if (this.modelValue != null) {
            this.selected = this.tables.find(v => v.name === this.modelValue)
            if (this.selected == null) {
              this.handleChange(null)
            }
          }
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    }
  },
  created () {
    this.fetchDatabases()
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
