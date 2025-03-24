<template>
  <el-select
    class="mysql-field-select"
    popper-class="mysql-field-select__popper"
    :multiple="multiple"
    :model-value="modelValue == null ? [] : modelValue.map(f => f.name)"
    @update:modelValue="handleInput"
  >
    <el-option @click="selectedAll = !selectedAll, selectAll()" disabled>
      <div class="option-content">
        <el-checkbox v-model="selectedAll" @change="selectAll"/>
        <span>全选</span>
      </div>
    </el-option>
    <el-option v-for="field in copyFields" :value="field.name" :label="field.name">
      <div class="option-content">
        <el-checkbox v-model="field.__selected"/>
        <ul>
          <li>{{ field.name }}</li>
          <li>{{ field.type }}</li>
          <li class="comment">{{ field.comment }}</li>
        </ul>
      </div>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'MySqlFieldSelect',
  props: {
    modelValue: {},
    table: {
      required: true
    },
    multiple: {
      default: true
    }
  },
  data () {
    return {
      // 拷贝的字段，避免直接影响表结构
      copyFields: [],
      // 是否选中所有
      selectedAll: false
    }
  },
  methods: {
    // 全选
    selectAll () {
      if (this.selectedAll) {
        this.handleInput(this.copyFields.map(f => f.name))
        return
      }
      this.handleInput([])
    },
    // 处理选中
    handleInput (fieldNames) {
      // 处理选中
      this.copyFields.forEach(field => {
        field.__selected = false
      })
      fieldNames.forEach(name => {
        const field = this.copyFields.find(f => f.name === name)
        if (field == null) {
          return
        }
        field.__selected = true
      })
      // 处理全选状态
      this.selectedAll = false
      if (fieldNames.length === this.copyFields.length) {
        this.selectedAll = true
      }
      this.$emit(
        'update:modelValue',
        fieldNames
          // 找到field对象
          .map(name => {
            return this.copyFields.find(field => field.name === name)
          })
          // 过滤掉未找到的对象
          .filter(field => field != null)
      )
    }
  },
  created () {
    this.copyFields = JSON.parse(JSON.stringify(this.table.fields))
    // 触发选中，避免字段修改后不生效，同时也可以初始化选中状态
    if (this.modelValue != null && this.modelValue.length > 0) {
      this.handleInput(this.modelValue.map(f => f.name))
    }
  }
}
</script>

<style scoped lang="scss">
.mysql-field-select {
  width: 100%;
  // 调整选中效果
  :deep(.el-select__selected-item) .el-tag{
    background-color: var(--primary-color-match-1-light);
    color: var(--color-service-name);
  }
}
</style>
<style lang="scss">
.mysql-field-select__popper {
  .el-select-dropdown__wrap {
    max-height: 500px;
  }
  .el-select-dropdown__item {
    height: initial;
    line-height: initial;
    // 全选行
    &:first-of-type {
      background-color: transparent !important;
      cursor: pointer;
      .option-content {
        color: var(--font-color) !important;
        border-bottom: 1px solid var(--border-default-color);
      }
    }
    &.is-selected {
      font-weight: normal;
    }
  }
  .option-content {
    display: flex;
    gap: 10px;
    align-items: center;
    position: relative;
    ul {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 10px;
      li {
        width: 30%;
        flex-shrink: 0;
        white-space: normal;
        word-break: break-all;
        &.comment {
          width: 40%;
          flex-shrink: 0;
          padding-right: 30px;
        }
      }
    }
  }
}
</style>
