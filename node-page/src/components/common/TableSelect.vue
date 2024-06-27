<template>
  <div class="table-select">
    <div class="table-select__wrap">
      <el-select
        popper-class="table-select__popper"
        :model-value="modelValue"
        clearable
        :loading="globalLoading.tables"
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
    <!-- 数据库连接失败提示 -->
    <p v-if="currentDatabaseConnect.error != null" class="connect-error">数据库连接失败：{{ currentDatabaseConnect.error }}</p>
    <!-- 字段设置（含字段选择和字段设置表） -->
    <ul v-if="currentTable != null && fieldVariableGroup.length > 0" class="field-settings">
      <li v-for="group of fieldVariableGroup" :key="group.label">
        <FieldSetting
          :value-key="valueKey"
          :table="currentTable"
          :group="group"
          @change="$emit('change')"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import FieldSetting from '@/components/service/installer/FieldSetting'

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
      selected: null
    }
  },
  computed: {
    ...mapState(['tables', 'globalLoading', 'currentDatabaseConnect']),
    // 获取表字段变量组，组中包含了表字段的扩展变量
    fieldVariableGroup () {
      return this.variable.children || []
    },
    // 当前选中的表对象
    currentTable () {
      if (this.modelValue == null) {
        return null
      }
      return this.tables.find(table => table.name === this.modelValue)
    }
  },
  watch: {
    // 当表集合加载完成时，触发一次表选择，防止选中了不存在的表
    'globalLoading.tables': {
      immediate: true,
      handler (newValue) {
        if (!newValue) {
          this.handleChange(this.modelValue)
        }
      }
    }
  },
  methods: {
    ...mapActions(['fetchTables']),
    // 切换表选择
    handleChange (value) {
      // 如果正在加载表，则不做处理，避免加载表时间过长时，导致tables中还没有表或是其它数据库的表，引起值清空
      if (this.globalLoading.tables) {
        return
      }
      // 清空表字段变量组的值（可能是默认值，取决于valueKey属性）
      this.fieldVariableGroup.forEach(group => {
        group[this.valueKey] = []
      })
      // 如果未找到对应的表，则清空选择
      if (this.tables.find(table => table.name === value) == null) {
        this.$emit('update:modelValue', null)
        this.$emit('change', null)
        return
      }
      this.$emit('update:modelValue', value)
      this.$emit('change', value)
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
.connect-error {
  color: var(--color-danger);
  line-height: 20px;
  margin-top: 5px;
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
