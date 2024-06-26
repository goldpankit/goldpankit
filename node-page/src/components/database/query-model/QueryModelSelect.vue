<template>
  <div class="query-model-select">
    <el-select
      popper-class="model-select__popper"
      :model-value="modelValue"
      clearable
      @change="handleChange"
    >
      <el-option
        v-for="model in models"
        :key="model.id"
        :value="model.id"
        :label="model.name"
      >
        <p class="option-content">
          <span>{{ model.name }}</span>
          <span class="text-info-1">{{ model.comment }}</span>
        </p>
      </el-option>
    </el-select>
    <el-button class="button-icon" type="primary" @click="$refs.queryModelWindow.open()">
      <img src="/images/database/icon-design.svg" alt="查询模型">
    </el-button>
    <p></p>
    <!-- 查询模型设计窗口 -->
    <QueryModelWindow ref="queryModelWindow" @close="refreshFieldSetting"/>
  </div>
  <!-- 数据库连接失败提示 -->
  <p v-if="currentDatabaseConnect.error != null" class="connect-error">数据库连接失败：{{ currentDatabaseConnect.error }}</p>
  <!-- 字段变量组设置 -->
  <ul v-if="currentModel != null && fieldVariableGroup.length > 0" class="field-settings">
    <li v-for="group of fieldVariableGroup" :key="group.label">
      <QueryModelFieldSetting
        :ref="`${group.name}FieldSetting`"
        :value-key="valueKey"
        :model="currentModel"
        :group="group"
        @change="$emit('change')"
      />
    </li>
  </ul>
</template>

<script>
import {mapState} from "vuex";
import QueryModelFieldSetting from "../../service/installer/QueryModelFieldSetting.vue";
import QueryModelWindow from "./QueryModelWindow.vue";

export default {
  name: "QueryModelSelect",
  components: {QueryModelWindow, QueryModelFieldSetting},
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
  computed: {
    ...mapState(['models', 'globalLoading', 'currentDatabaseConnect']),
    // 获取模型字段变量组，组中包含了表字段的扩展变量
    fieldVariableGroup () {
      return this.variable.children || []
    },
    // 当前选中的表对象
    currentModel () {
      if (this.modelValue == null) {
        return null
      }
      return this.models.find(model => model.id === this.modelValue)
    }
  },
  watch: {
    // 当查询模型加载完成时，重新触发一次选中，避免选中了不存在的模型
    'globalLoading.models': {
      immediate: true,
      handler (newValue) {
        if (!newValue) {
          this.handleChange(this.modelValue)
        }
      }
    },
    // 模型集合数量发生变化时，重新触发一次选中，避免选中了不存在的模型
    'models.length' () {
      this.handleChange(this.modelValue)
    }
  },
  methods: {
    // 切换模型选择
    handleChange (value) {
      // 如果和当前选择的模型不一致，则清空模型字段变量组的值（可能是默认值，取决于valueKey属性）
      if (this.modelValue !== value) {
        this.fieldVariableGroup.forEach(group => {
          group[this.valueKey] = []
        })
      }
      // 如果未找到对应的模型，则清空选择
      if (this.models.find(model => model.id === value) == null) {
        this.$emit('update:modelValue', null)
        this.$emit('change', null)
        return
      }
      this.$emit('update:modelValue', value)
      this.$emit('change')
    },
    // 刷新各字段变量组的字段设置
    refreshFieldSetting () {
      for (const fieldGroup of this.fieldVariableGroup) {
        this.$refs[`${fieldGroup.name}FieldSetting`][0].refresh()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.query-model-select {
  display: flex;
  :deep(.el-button) {
    width: 42px;
    height: 42px;
    margin-left: 1px;
    img {
      width: 14px;
    }
  }
  .el-select {
    flex-grow: 1;
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

<style scoped lang="scss">
.model-select__popper {
  .option-content {
    display: flex;
    justify-content: space-between;
  }
}
</style>
