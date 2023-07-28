<template>
  <el-select
    class="model-select"
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
  <ul v-if="selected != null && fieldVariableGroup.length > 0" class="field-settings">
    <li v-for="group of fieldVariableGroup" :key="group.label">
      <QueryModelFieldSetting :value-key="valueKey" :table="selected" :group="group"/>
    </li>
  </ul>
</template>

<script>

import {mapState} from "vuex";
import QueryModelFieldSetting from "../service/installer/QueryModelFieldSetting.vue";
import {search} from "../../api/database";

export default {
  name: "QueryModelSelect",
  components: {QueryModelFieldSetting},
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
      databases: [],
      models: [],
      selected: null
    }
  },
  computed: {
    ...mapState(['currentProject', 'currentDatabase']),
    // 获取表字段变量组，组中包含了表字段的扩展变量
    fieldVariableGroup () {
      return this.variables.filter(v => v.type === 'group' && v.scope === 'query_model_field')
    }
  },
  watch: {
    currentDatabase () {
      this.fetchModels()
    }
  },
  methods: {
    // 切换表选择
    handleChange (value) {
      this.selected = this.models.find(model => model.id === value)
      // 清空表字段变量组的值（可能是默认值，取决于valueKey属性）
      this.fieldVariableGroup.forEach(group => {
        group[this.valueKey] = []
      })
      this.$emit('update:modelValue', value)
      this.$emit('change', value)
    },
    // 查询数据库
    fetchDatabases () {
      search ()
        .then(data => {
          this.databases = data
          this.fetchModels()
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 查询模型
    fetchModels () {
      const database = this.databases.find(db => db.id === this.currentDatabase)
      if (database == null) {
        this.models = []
        return
      }
      this.models = database.models
      // 填充默认选中的table
      if (this.modelValue != null) {
        this.selected = this.models.find(model => model.id === this.modelValue)
      }
      console.log('this.selected', this.selected)
    }
  },
  created () {
    this.fetchDatabases()
  }
}
</script>

<style scoped lang="scss">
.model-select {
  width: 100%;
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
