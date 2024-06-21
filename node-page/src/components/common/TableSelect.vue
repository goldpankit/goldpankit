<template>
  <el-select
    class="table-select"
    popper-class="table-select__popper"
    :model-value="modelValue"
    clearable
    :loading="loading.tables"
    loading-text="正在获取数据库表，请稍后..."
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
      <FieldSetting :value-key="valueKey" :table="selected" :group="group" @change="$emit('change')"/>
    </li>
  </ul>
</template>

<script>
import { mapState } from 'vuex';
import FieldSetting from "@/components/service/installer/FieldSetting.vue";
import { fetchTables } from '@/api/database.util'

export default {
  name: 'TableSelect',
  components: { FieldSetting },
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
      loading: {
        tables: false
      },
      selected: null,
      tables: []
    }
  },
  computed: {
    ...mapState(['databases', 'currentProject', 'currentDatabase']),
    // 获取表字段变量组，组中包含了表字段的扩展变量
    fieldVariableGroup () {
      return this.variable.children || []
    }
  },
  watch: {
    // 当数据库发生变化时，重新获取表
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
    // 查询表
    fetchTables () {
      const database = this.databases.find(db => db.id === this.currentDatabase)
      if (database == null) {
        this.tables = []
        this.handleChange(null)
        return
      }
      this.loading.tables = true
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
        .finally(() => {
          this.loading.tables = false
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
