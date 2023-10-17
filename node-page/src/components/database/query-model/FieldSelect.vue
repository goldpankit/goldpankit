<template>
  <div class="model-field-select">
    <el-popover
      trigger="click"
      popper-class="model-field-select-popper"
      :hide-after="0"
      :persistent="false"
      @hide="close"
    >
      <template #reference>
        <ul
          class="selected-preview"
          :class="{'is-focus': focused}"
          v-sortable:config="{
            data: selectedFields,
            onChange: handleFieldSorted
          }"
          @click="focus"
        >
          <li v-if="selectedFields.length === 0" class="placeholder">请选择</li>
          <li
            v-else
            v-for="field of selectedFields"
            :key="field.name"
            :class="{ 'field-light': currentHoverTable != null && field.table.id === currentHoverTable.id }"
            @mouseenter="handleFieldEnter(field)"
            @mouseleave="handleFieldLeave"
          >
            <p>
              {{field.table.alias}}.{{field.name}}
              <template v-if="field.alias !== field.name">
                <em>AS</em> <b>{{field.alias}}</b>
              </template>
            </p>
            <p v-if="field.comment != null && field.comment !== ''">{{field.comment}}</p>
          </li>
        </ul>
      </template>
      <div class="field-select__tables">
        <div
          v-for="table in tables"
          :key="table.alias"
          class="field-select__table"
          :class="{
            'table-main': table.type === 'MAIN',
            'table-light': currentHoverField != null && table.id === currentHoverField.table.id
          }"
          @mouseenter="handleTableEnter(table)"
          @mouseleave="handleTableLeave"
        >
          <div class="table__header">
            <el-checkbox
              v-model="table.checkedAll"
              @change="handleCheckAllChange(table, $event)"
            >
              <h4>{{table.name}} AS {{table.alias}}</h4>
            </el-checkbox>
          </div>
          <div class="table__fields-wrap">
            <el-scrollbar>
              <div class="table-fields">
                <el-checkbox-group :model-value="modelValue" @change="handleInput(table, $event)">
                  <el-checkbox
                    v-for="field in table.fields"
                    :label="`${table.id}.${field.name}`"
                    :key="field.name"
                  >
                    <p>
                      {{field.name}}
                      <template v-if="field.alias !== field.name">
                        <em>AS</em> <b>{{field.alias}}</b>
                      </template>
                    </p>
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
      // 是否聚焦
      focused: false,
      // 表
      tables: [],
      // 已选中的字段
      selectedFields: [],
      // 当前悬浮的表
      currentHoverTable: null,
      // 当前悬浮的字段
      currentHoverField: null,
      // 离开字段时计时器，防止
      leaveFieldTimeout: null
    }
  },
  watch: {
    model: {
      immediate: true,
      handler () {
        this.__handleTables()
      }
    },
    modelValue: {
      immediate: true,
      handler () {
        // 此处给this.selectedFields赋值，不能修改引用地址，否则排序后无法获取到最新排序内容
        this.selectedFields.splice(0, this.selectedFields.length)
        this.selectedFields.push.apply(this.selectedFields, this.__getSelectedFieldsObjects(this.modelValue))
      }
    },
  },
  methods: {
    // 聚焦选择
    focus () {
      this.focused = true
    },
    // 处理字段排序
    handleFieldSorted () {
      this.$emit('update:modelValue', this.selectedFields.map(field => {
        return `${field.table.id}.${field.name}`
      }))
      this.$emit('fields:change', this.selectedFields)
    },
    // 全选
    handleCheckAllChange (table, checkedAll) {
      // 当前表选中的字段
      let tableSelectedFields = []
      if (checkedAll) {
        tableSelectedFields = table.fields.map(f => `${table.id}.${f.name}`)
      }
      // 当前已选中的全部字段
      let values = this.modelValue
      // 排除掉当前表选中的字段
      values = values.filter(value => !value.startsWith(`${table.id}.`))
      // 拼接上最新的当前表选中的字段
      values = values.concat(tableSelectedFields)
      // 触发input事件
      this.handleInput(table, values)
    },
    // 处理输入
    handleInput (table, fieldNames) {
      // 处理选中全部
      const tableSelectedFields = fieldNames.filter(f => f.startsWith(`${table.id}.`))
      table.checkedAll = tableSelectedFields.length === table.fields.length
      // 获取所有选中的字段
      let selectedFields = this.__getSelectedFieldsObjects(fieldNames)
      // 此处给this.selectedFields赋值，不能修改引用地址，否则排序后无法获取到最新排序内容
      this.selectedFields.splice(0, this.selectedFields.length)
      this.selectedFields.push.apply(this.selectedFields, selectedFields)
      // 触发事件
      this.$emit('update:modelValue', fieldNames)
      this.$emit('fields:change', this.selectedFields)
    },
    // 鼠标悬浮字段
    handleFieldEnter (field) {
      if (this.leaveFieldTimeout != null) {
        clearTimeout(this.leaveFieldTimeout)
      }
      this.currentHoverField = field
    },
    // 鼠标离开表
    handleFieldLeave () {
      this.leaveFieldTimeout = setTimeout(() => {
        this.currentHoverField = null
      }, 500)
    },
    // 鼠标悬浮在表
    handleTableEnter (table) {
      this.currentHoverTable = table
    },
    // 鼠标离开表
    handleTableLeave () {
      this.currentHoverTable = null
    },
    // 关闭选择
    close () {
      this.focused = false
      this.handleTableLeave()
      this.handleFieldLeave()
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
    },
    // 获取选中的字段对象
    __getSelectedFieldsObjects (fieldNames) {
      return fieldNames
        // 找到field对象并填充table字段
        .map(name => {
          // 选中的value值类似为xxxx.NAME，其中xxxx为表ID，NAME为字段名称
          const tableId = name.split('.')[0]
          const fieldName = name.split('.')[1]
          // 找到字段所在的表
          const table = this.model.tables.find(t => t.id === tableId)
          // 找到字段
          const field = table.fields.find(field => field.name === fieldName)
          if (field == null) {
            return null
          }
          // 拷贝表和字段（此处需保证每次选择的都是独立的字段和表信息，防止数据污染导致莫名其妙的BUG）
          const tableDump = JSON.parse(JSON.stringify(table))
          const fieldDump = JSON.parse(JSON.stringify(field))
          // 填充表信息（表信息中不要再包含字段信息，避免数据循环依赖）
          delete tableDump.fields
          fieldDump.table = tableDump
          return fieldDump
        })
        // 过滤掉未找到的对象
        .filter(field => field != null)
    }
  }
}
</script>

<style scoped lang="scss">
.model-field-select {
  .selected-preview {
    min-height: 32px;
    border-radius: 5px;
    border: 1px solid #eee;
    background-color: var(--color-light);
    display: flex;
    flex-wrap: wrap;
    padding: 5px 10px 0 10px;
    transition: border-color ease .15s;
    &:hover {
      border-color: var(--input-border-hover-color);
    }
    &.is-focus {
      border-color: var(--input-border-color);
    }
    li {
      height: initial;
      line-height: initial;
      padding: 5px 10px;
      background-color: var(--primary-color-match-1);
      margin-right: 5px;
      margin-bottom: 5px;
      border-radius: 5px;
      font-size: var(--font-size-mini);
      cursor: default;
      &:hover {
        background-color: var(--primary-color-match-1-transition);
      }
      // 占位字符
      &.placeholder {
        color: var(--color-gray);
        background-color: transparent;
        padding: 5px 0;
        font-size: var(--font-size);
      }
      // 字段悬浮
      &.field-light {
        transition: all ease .15s;
        animation: shine 0.3s 3;
        background-color: var(--primary-color-match-1-transition);
      }
      // 关键字
      em {
        color: var(--primary-color-match-2);
        font-weight: bold;
        font-style: normal;
      }
    }
  }
  @keyframes shine {
    0% {
      background-color: var(--primary-color-match-1-transition);
    }
    50% {
      background-color: var(--primary-color-match-1);
    }
    100% {
      background-color: var(--primary-color-match-1-transition);
    }
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
      &.table-main {
        .table__header{
          background-color: var(--primary-color-match-2);
          &:hover {
            background-color: var(--primary-color-match-2-transition);
          }
        }
        // 高亮表
        &.table-light {
          .table__header {
            animation: shineMainTable .3s 3;
            background-color: var(--primary-color-match-2-transition);
          }
        }
      }
      // 高亮表
      &.table-light {
        .table__header {
          animation: shineSubTable .3s 3;
          background-color: var(--primary-color);
        }
      }
      // 表头
      .table__header {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        padding: 8px 10px;
        background-color: #666;
        color: var(--color-light);
        &:hover {
          background-color: var(--primary-color);
        }
        .el-checkbox {
          width: 100%;
          margin-right: 0;
          .el-checkbox__input {
            flex-shrink: 0;
          }
          .el-checkbox__label {
            flex-grow: 1;
            overflow: hidden;
            white-space: initial;
          }
        }
        h4 {
          font-size: var(--font-size-mini);
          color: var(--color-light);
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
                em {
                  color: var(--primary-color-match-2);
                  font-weight: bold;
                  font-style: normal;
                }
              }
            }
          }
        }
      }
    }
  }
  // 子表提示动画
  @keyframes shineSubTable {
    0% {
      background-color: var(--primary-color);
    }
    50% {
      background-color: #666;
    }
    100% {
      background-color: var(--primary-color);
    }
  }
  // 主表提示动画
  @keyframes shineMainTable {
    0% {
      background-color: var(--primary-color-match-2);
    }
    50% {
      background-color: var(--primary-color-match-2-transition);
    }
    100% {
      background-color: var(--primary-color-match-2);
    }
  }
}
</style>
