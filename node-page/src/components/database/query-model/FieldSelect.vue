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
          <li v-if="selectedFields.length === 0" class="placeholder">请选择字段</li>
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
            </p>
            <p v-if="field.comment != null && field.comment !== ''">{{field.comment}}</p>
            <span class="button-close" @click.stop="deleteField(field.table.id, field.name)">
              <el-icon><Close/></el-icon>
            </span>
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
import { copyData } from '@/utils/util'

export default {
  name: 'QueryModelFieldSelect',
  props: {
    modelValue: {},
    model: {
      required: true
    },
    multiple: {
      default: true
    },
    /*
    默认选中的字段对象数组，用于初始化已选字段的配置
    处理场景：从kit.json中读取了字段配置，为了避免选中了不存在的字段，所以会率先调用一次selectedFields
    每次选择字段时也会触发该方法，为了避免每次选中字段后影响了其它字段的配置信息，会与当前已选中字段对象进行对比，如果不存在则视为选择动作添加了字段
    此时如果selectedFields中为空数组，那么始终都是添加字段，该字段在组件初始化时被赋值到selectedFields字段中，以避免初始化时没有丢失字段的配置信息
    */
    defaultSelectedFieldObjects: {
      type: Array
    }
  },
  data () {
    return {
      // 是否聚焦
      focused: false,
      // 表
      tables: [],
      // 已选中的字段
      selectedFields: this.defaultSelectedFieldObjects,
      // 当前悬浮的表
      currentHoverTable: null,
      // 当前悬浮的字段
      currentHoverField: null,
      // 离开字段时计时器，防止
      leaveFieldTimeout: null
    }
  },
  watch: {
    // 选择的模型发生变化后，刷新表字段，使用immediate在首次进入时也会刷新表，进一步触发字段选中
    model: {
      immediate: true,
      handler () {
        this.refreshTables()
      }
    }
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
    // 删除字段选中
    deleteField (tableId, fieldName) {
      const table = this.model.tables.find(t => t.id === tableId)
      const newSelectedFields = this.modelValue.filter(field => {
        return `${table.id}.${fieldName}` !== field
      })
      this.handleInput(table, newSelectedFields)
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
    /**
     * 处理字段选中
     *
     * @param table 字段所在表
     * @param allSelectedFieldNames 所有选中的字段名称['表ID.表字段', ...]
     */
    handleInput (table, allSelectedFieldNames) {
      // 获取到当前表选中的字段
      const tableSelectedFields = allSelectedFieldNames.filter(f => f.startsWith(`${table.id}.`))
      // 如果选中的字段数 = 表的字段数（这里表的字段已经为全部显示的字段），则视为选中了全部
      table.checkedAll = tableSelectedFields.length === table.fields.length
      // 选择字段
      this.selectFields(allSelectedFieldNames)
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
    refreshTables () {
      this.tables = []
      for (const table of this.model.tables) {
        // 只获取显示的字段列表
        const visibleFields = table.fields.filter(f => f.visible)
        // 如果表存在显示的字段，则纳入可选择的表中
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
      this.selectFields(this.modelValue)
    },
    // 选择字段，如果字段不存在会清空选择
    selectFields (fieldNames) {
      // 先获取到新的选中字段，在此之前不要清空当前已选字段信息，避免填写的字段配置被直接清空
      const newSelectedFieldsObjects = this.__getExistsSelectedFieldsObjects(fieldNames)
      // 此处给this.selectedFields赋值，不能修改引用地址，否则排序后无法获取到最新排序内容
      this.selectedFields.splice(0, this.selectedFields.length)
      this.selectedFields.push.apply(this.selectedFields, newSelectedFieldsObjects)
      // 触发事件
      this.$emit('update:modelValue', this.selectedFields.map(f => f.table.id + '.' + f.name))
      this.$emit('fields:change', this.selectedFields)
    },
    // 获取已存在并选中的字段对象
    __getExistsSelectedFieldsObjects (fieldNames) {
      // 已存在并选中的字段对象
      const existsSelectedFields = fieldNames
        // 找到field对象并填充table字段
        .map(name => {
          // 选中的value值类似为xxxx.NAME，其中xxxx为表ID，NAME为字段名称
          const tableId = name.split('.')[0]
          const fieldName = name.split('.')[1]
          // 找到字段所在的表
          const table = this.tables.find(t => t.id === tableId)
          if (table == null) {
            return null
          }
          // 找到字段（table.fields为全部显示的字段）
          const field = table.fields.find(field => field.name === fieldName)
          if (field == null) {
            return null
          }
          // 拷贝表和字段，去掉fields和table，避免table.fields与field.table循环引用
          const copyTable = copyData(table, ['fields'])
          const copyField = copyData(field, ['table'])
          copyField.table = copyTable
          return copyField
        })
        // 过滤掉未找到的对象
        .filter(field => field != null)
      // 构建新选择的字段数组
      const newSelectedFields = []
      for (const existsSelectedField of existsSelectedFields) {
        // 从当前已选中的字段中获取与当前字段匹配的字段
        const currentIndex = this.selectedFields.findIndex(selectedField => {
          return selectedField.table.id === existsSelectedField.table.id && selectedField.name === existsSelectedField.name
        })
        // 如果在已选中未找到字段信息，则为新选的字段
        if (currentIndex === -1) {
          newSelectedFields.push(existsSelectedField)
          continue
        }
        // 如果在已选中找到了字段，则更新别名和table，只有别名和table会发生变化
        const currentField = this.selectedFields[currentIndex]
        currentField.alias = existsSelectedField.alias
        currentField.table = existsSelectedField.table
        newSelectedFields.push(currentField)
      }
      return newSelectedFields
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
    cursor: pointer;
    &:hover {
      border-color: var(--input-border-hover-color);
    }
    &.is-focus {
      border-color: var(--input-border-color);
    }
    li {
      height: initial;
      line-height: initial;
      padding: 5px 30px 5px 10px;
      background-color: #f2f2f2;
      margin-right: 5px;
      margin-bottom: 5px;
      border-radius: 5px;
      font-size: var(--font-size-mini);
      position: relative;
      .button-close {
        width: 14px;
        height: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 50%;
        right: 5px;
        border-radius: 50%;
        background-color: transparent;
        transform: translateY(-50%);
        &:hover {
          background-color: #999;
          color: #fff;
        }
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
        background-color: var(--primary-color-match-1);
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
      background-color: var(--primary-color-match-1);
    }
    50% {
      background-color: var(--primary-color-match-1-light);
    }
    100% {
      background-color: var(--primary-color-match-1);
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
