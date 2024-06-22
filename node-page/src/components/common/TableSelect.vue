<template>
  <div class="table-select">
    <div class="table-select__wrap">
      <el-select
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
      <!-- 刷新按钮 -->
      <el-button class="button-icon" type="primary" icon="Refresh" @click="fetchTables"/>
    </div>
    <!-- 字段设置（含字段选择和字段设置表） -->
    <ul v-if="selected != null && fieldVariableGroup.length > 0" class="field-settings">
      <li v-for="group of fieldVariableGroup" :key="group.label">
        <FieldSetting
          :value-key="valueKey"
          :table="selected"
          :group="group"
          @change="$emit('change')"
        />
      </li>
    </ul>
    <ErrorWindow ref="errorWindow"/>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import FieldSetting from "@/components/service/installer/FieldSetting.vue";
import { fetchTables } from '@/api/database.util'
import ErrorWindow from "@/components/common/ErrorWindow.vue";

export default {
  name: 'TableSelect',
  components: {ErrorWindow, FieldSetting },
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
    ...mapState(['databases', 'globalLoading', 'currentProject', 'currentDatabase']),
    // 获取表字段变量组，组中包含了表字段的扩展变量
    fieldVariableGroup () {
      return this.variable.children || []
    }
  },
  watch: {
    // 当数据库发生变化时，重新获取表
    currentDatabase: {
      immediate: true,
      handler () {
        this.fetchTables()
      }
    },
    // 当数据库加载完成时，触发一次数据库选择，防止选中了不是当前项目的数据库，此处一定要监听第一次变化，防止刷新时不能初始化选中数据库
    'globalLoading.databases' (newValue) {
      if (!newValue) {
        this.fetchTables(this.modelValue)
      }
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
      // 如果数据库正在加载中，则不查询，在数据库加载完成后会重新触发该事件
      if (this.globalLoading.databases) {
        return
      }
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
          this.tables = []
          this.handleChange(null)
          this.$refs.errorWindow.open({
            title: '获取表失败',
            message: e.message
          })
        })
        .finally(() => {
          this.loading.tables = false
        })
    }
  }
}
</script>

<style scoped lang="scss">
.table-select {
  width: 100%;
  .table-select__wrap {
    display: flex;
    overflow: hidden;
    border-radius: 5px;
    :deep(.el-select) {
      flex-grow: 1;
      .el-select__wrapper {
        border-radius: 5px 0 0 5px;
        .el-select__selected-item {
          color: var(--color-service-name) !important;
          font-weight: bold;
        }
      }
    }
    .el-button {
      flex-shrink: 0;
      border: 0;
      border-radius: 0;
      width: 40px;
      height: 40px;
    }
  }
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
