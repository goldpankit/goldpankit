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
          v-for="table in tables"
          :key="table.alias"
          class="field-select__table"
          :class="{'table-main': table.type === 'MAIN'}"
        >
          <div class="table__header">
            <el-checkbox
              v-model="table.checkedAll"
              @change="handleCheckAllChange(table, $event)"
            ></el-checkbox>
            <h4>{{table.name}} AS {{table.alias}}</h4>
          </div>
          <div class="table__fields-wrap">
            <el-scrollbar>
              <div class="table-fields">
                <el-checkbox-group :model-value="modelValue" @change="handleInput">
                  <el-checkbox
                    v-for="field in table.fields"
                    :label="`${table.id}.${field.name}`"
                    :key="field.name"
                  >
                    <p>{{field.name}}</p>
                    <p v-if="field.comment !== ''" class="text-info-1">{{field.comment}}</p>
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </el-popover>
  </div>
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
  data () {
    return {
      // 表
      tables: []
    }
  },
  watch: {
    model: {
      immediate: true,
      handler () {
        this.__handleTables()
      }
    }
  },
  methods: {
    // 全选
    handleCheckAllChange (table, checkedAll) {
      let tableSelectedFields = []
      if (checkedAll) {
        tableSelectedFields = table.fields.map(f => `${table.id}.${f.name}`)
      }
      let values = JSON.parse(JSON.stringify(this.modelValue))
      values = values.filter(value => !value.startsWith(`${table.id}.`))
      values = values.concat(tableSelectedFields)
      this.handleInput(values)
    },
    // 处理输入
    handleInput (fieldNames) {
      this.$emit('update:modelValue', fieldNames)
      this.$emit('fields:change', fieldNames
        // 找到field对象并填充table字段
        .map(name => {
          // 选中的value值类似为xxxx.NAME，其中xxxx为表ID，NAME为字段名称
          const tableId = name.split('.')[0]
          const fieldName = name.split('.')[1]
          // 找到字段所在的表
          const table = this.model.tables.find(t => t.id === tableId)
          const tableDump = JSON.parse(JSON.stringify(table))
          // 找到字段
          const field = table.fields.find(field => field.name === fieldName)
          // 填充表信息（表信息中不要再包含字段信息，避免数据循环依赖）
          delete tableDump.fields
          field.table = tableDump
          return field
        })
        // 过滤掉未找到的对象
        .filter(field => field != null))
    },
    // 获取表数据
    __handleTables () {
      this.tables = []
      for (const table of this.model.tables) {
        const visibleFields = table.fields.filter(f => f.visible)
        if (visibleFields.length > 0) {
          this.tables.push({
            id: table.id,
            type: table.type,
            name: table.name,
            alias: table.alias,
            fields: visibleFields,
            checkedAll: false
          })
        }
      }
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
          .el-checkbox-group {
            display: flex;
            flex-direction: column;
            .el-checkbox {
              width: 100%;
              height: auto;
              padding: 5px 15px 5px 10px;
              margin-right: 0;
              background-color: var(--color-light);
              border-top: 1px solid var(--border-default-color);
              &:hover {
                background-color: var(--border-default-color);
              }
              .el-checkbox__input {
                flex-shrink: 0;
              }
              .el-checkbox__label {
                flex-grow: 1;
                overflow: hidden;
                p {
                  white-space: initial;
                  font-weight: normal;
                  font-size: var(--font-size-mini);
                  color: var(--font-color);
                  &:last-of-type {
                    margin-top: 3px;
                    color: var(--color-gray);
                  }
                }
              }
            }
          }
          //li {
          //  display: flex;
          //  padding: 5px 15px 5px 10px;
          //  align-items: center;
          //  font-size: var(--font-size-mini);
          //  background-color: var(--color-light);
          //  border-top: 1px solid var(--border-default-color);
          //  .el-checkbox {
          //    margin-right: 10px;
          //  }
          //  & > div {
          //    height: auto;
          //    line-height: initial;
          //  }
          //  &:hover {
          //    background-color: var(--border-default-color);
          //  }
          //}
        }
      }
    }
  }
}
</style>
