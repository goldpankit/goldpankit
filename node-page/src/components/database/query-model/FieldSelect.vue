<template>
  <div class="model-field-select">
    <el-popover
      trigger="click"
      popper-class="model-field-select-popper"
      :hide-after="0"
      :persistent="false"
    >
      <template #reference>
        <ul class="selected-preview">
        </ul>
      </template>
      <div class="field-select__tables">
        <div
          v-for="fieldGroup in fieldGroups"
          :key="fieldGroup.alias"
          class="field-select__table"
          :class="{'table-main': fieldGroup.type === 'MAIN'}"
        >
          <div class="table__header">
            <el-checkbox></el-checkbox>
            <h4>{{fieldGroup.name}} AS {{fieldGroup.alias}}</h4>
          </div>
          <div class="table__fields-wrap">
            <el-scrollbar>
              <ul class="table-fields">
                <li
                  v-for="field in fieldGroup.options"
                  :key="field.name"
                >
                  <el-checkbox></el-checkbox>
                  <div>
                    <p>{{field.name}}</p>
                    <p v-if="field.comment !== ''" class="text-info-1">{{field.comment}}</p>
                  </div>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </el-popover>

  </div>
<!--  <el-select-->
<!--    class="mysql-field-select"-->
<!--    popper-class="mysql-field-select__popper"-->
<!--    clearable-->
<!--    :multiple="multiple"-->
<!--    :model-value="modelValue == null ? [] : modelValue.map(f => f.table.alias + '.' + f.name)"-->
<!--    @update:modelValue="handleInput"-->
<!--  >-->
<!--    <el-option-group-->
<!--      v-for="fieldGroup in fieldGroups"-->
<!--      :key="fieldGroup.alias"-->
<!--      :label="`${fieldGroup.name} AS ${fieldGroup.alias}`"-->
<!--    >-->
<!--      <el-option-->
<!--        v-for="field in fieldGroup.options"-->
<!--        :value="fieldGroup.alias + '.' + field.name"-->
<!--        :label="fieldGroup.alias + '.' + field.name"-->
<!--      >-->
<!--        <p class="option-content">-->
<!--          <span>{{fieldGroup.alias}}.{{ field.name }}</span>-->
<!--          <span class="text-info-1">{{ field.comment }}</span>-->
<!--        </p>-->
<!--      </el-option>-->
<!--    </el-option-group>-->
<!--  </el-select>-->
</template>

<script>
export default {
  name: "QueryModelFieldSelect",
  props: {
    modelValue: {},
    model: {
      required: true
    },
    multiple: {
      default: true
    }
  },
  computed: {
    fieldGroups () {
      let fieldGroups = []
      for (const table of this.model.tables) {
        const visibleFields = table.fields.filter(f => f.visible)
        if (visibleFields.length > 0) {
          fieldGroups.push({
            type: table.type,
            name: table.name,
            alias: table.alias,
            options: visibleFields
          })
        }
      }
      return fieldGroups
    },
    fields () {
      let fields = []
      for (const table of this.model.tables) {
        fields = fields.concat(table.fields)
      }
      return fields
    }
  },
  methods: {
    handleInput (fieldNames) {
      this.$emit('update:modelValue',
        fieldNames
          // 找到field对象并填充table字段
          .map(name => {
            // 选中的value值类似为xxxx.NAME，其中xxxx为表名，NAME为字段名称
            const tableName = name.split('.')[0]
            const fieldName = name.split('.')[1]
            // 找到字段所在的表
            const table = this.model.tables.find(t => t.alias === tableName)
            const tableDump = JSON.parse(JSON.stringify(table))
            // 找到字段
            const field = table.fields.find(field => field.name === fieldName)
            // 填充表信息（表信息中不要再包含字段信息，避免数据循环依赖）
            delete tableDump.fields
            field.table = tableDump
            return field
          })
          // 过滤掉未找到的对象
          .filter(field => field != null)
      )
    }
  }
}
</script>

<style scoped lang="scss">
.model-field-select {
  .selected-preview {
    height: 32px;
    border-radius: 5px;
    border: 1px solid #eee;
    background-color: var(--color-light);
  }
}
</style>
<style lang="scss">
.model-field-select-popper {
  width: auto !important;
  max-width: 1200px;
  padding: 16px !important;
  padding-bottom: 0 !important;
  box-sizing: content-box;
  .field-select__tables {
    display: flex;
    flex-wrap: wrap;
    // 表
    .field-select__table {
      --el-checkbox-height: 20px;
      flex-shrink: 0;
      margin-bottom: 12px;
      width: 225px;
      height: 350px;
      margin-right: 10px;
      background-color: var(--background-color);
      box-shadow: 0 0 10px -5px #999;
      border: 1px solid #eee;
      border-radius: 5px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      &:nth-of-type(5n) {
        margin-right: 0;
      }
      &:last-of-type {
        margin-right: 0;
      }
      // 主表
      &.table-main .table__header{
        background-color: var(--primary-color-match-2);
      }
      // 表头
      .table__header {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        padding: 5px 10px;
        background-color: #666;
        color: var(--color-light);
        h4 {
          margin-left: 10px;
          font-size: var(--font-size-mini);
        }
      }
      // 表字段
      .table__fields-wrap {
        flex-grow: 1;
        overflow: hidden;
        .table-fields {
          li {
            display: flex;
            padding: 5px 15px 5px 10px;
            align-items: center;
            font-size: var(--font-size-mini);
            background-color: var(--color-light);
            border-top: 1px solid var(--border-default-color);
            .el-checkbox {
              margin-right: 10px;
            }
            &:hover {
              background-color: var(--border-default-color);
            }
          }
        }
      }
    }
  }
}
</style>
