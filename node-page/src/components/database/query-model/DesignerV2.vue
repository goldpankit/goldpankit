<template>
  <div
    class="designer-v2"
    @dragover.prevent
    @drop="handleDrop($event)"
  >
    <div class="stage"></div>
    <div class="preview-wrap stage-preview-wrap">
      <h2>关系预览</h2>
      <div class="preview-stage"></div>
    </div>
    <div class="preview-wrap sql-preview-wrap">
      <h2>SQL预览</h2>
      <!-- 预览缩略 -->
      <div v-if="rerenderSqlPreview" class="sql-preview-editor"></div>
      <!-- 预览缩略盖板 -->
      <div class="sql-preview-panel" @click="openSqlPreviewWindow"></div>
    </div>
    <!-- 预览窗口 -->
    <TableSetting
      v-if="model != null"
      ref="tableSetting"
      :visible="model.__visibleSQLPreviewWindow"
      :model="model"
      :table="mainTable"
      :joins="mainTableJoins"
      :aggregates="mainTableAggregates"
      @field:change="$emit('change')"
    />
  </div>
</template>

<script>
import * as monaco from 'monaco-editor'
import ModelDesigner from './model-designer'
import { generateId } from '@/utils/generator'
import SQL from "@/components/database/query-model/SQL.vue";
import TableSetting from "@/components/database/query-model/TableSetting.vue";

let MD = null
export default {
  name: 'DesignerV2',
  components: {TableSetting, SQL },
  props: {
    model: {}
  },
  data () {
    return {
      sqlPreviewEditor: null,
      // 重新渲染SQL预览
      rerenderSqlPreview: false
    }
  },
  computed: {
    // 主表
    mainTable () {
      if (this.model == null) {
        return null
      }
      return this.model.tables.find(t => t.type === 'MAIN')
    },
    mainTableJoins () {
      if (this.model == null) {
        return []
      }
      return this.model.joins
    },
    mainTableAggregates () {
      if (this.model == null) {
        return []
      }
      return this.model.aggregates
    }
  },
  watch: {
    // 此处需要监听第一次，避免页面刷新后，通过模型选择器打开设计器无法初始化
    model: {
      immediate: true,
      handler () {
        this.init()
      }
    },
    mainTable: {
      immediate: true,
      handler () {
        this.refreshSQL()
      }
    },
    'model.__lineType' () {
      if (MD != null && this.model != null) {
        MD.lineType(this.model.__lineType)
      }
    }
  },
  methods: {
    // 初始化表
    init () {
      this.$nextTick(() => {
        // 重绘
        MD.redraw()
        MD.redrawPreview()
        if (this.model == null) {
          return
        }
        // 添加表
        for (const table of this.model.tables) {
          MD.createTable(table, table.x, table.y)
        }
        // 添加JOIN线
        for (const join of this.model.joins) {
          for (const on of join.ons) {
            MD.createLine({
              lineType: 'join',
              field: on.field,
              targetField: on.targetField,
              table: join.table,
              targetTable: join.targetTable
            })
          }
        }
        // 添加聚合线
        for (const aggregate of this.model.aggregates) {
          MD.createLine({
            lineType: 'aggregate',
            field: aggregate.field,
            targetField: aggregate.targetField,
            table: aggregate.table,
            targetTable: aggregate.targetTable
          })
        }
      })
    },
    // 拖拽表
    handleDrop (e) {
      if (this.model == null) {
        this.$tip.warning('请先选择或创建模型！')
        return
      }
      // 获取坐标
      MD.stage.setPointersPositions(e)
      const mousePos = MD.stage.getPointerPosition()
      const tableX = mousePos.x - MD.TABLE_WIDTH / 2
      const tableY = mousePos.y
      // 判断表类型
      const tableType = this.model.tables.length === 0 ? 'MAIN' : 'SUB'
      // 创建新表对象
      const newTable = {
        // 增加设计器元素ID
        id: generateId(),
        name: this.model.dragData.name,
        alias: this.model.dragData.name,
        // 第一个表标记为主表
        type: tableType,
        // 字段
        fields: this.model.dragData.fields.map(f => {
          let alias = `${this.model.dragData.name}_${f.name}`
          if (tableType === 'MAIN') {
            alias = `${f.name}`
          }
          return {
            ...f,
            alias: alias,
            visible: true,
            isVirtual: false
          }
        }),
        // 非虚拟表
        isVirtual: false,
        // 坐标
        x: tableX,
        y: tableY
      }
      // 添加到模型表中
      this.model.tables.push(newTable)
      // 创建表设计
      MD.createTable(newTable, tableX, tableY)
    },
    // 获取最新SQL语句
    refreshSQL () {
      this.rerenderSqlPreview = false
      this.sqlPreviewEditor = null
      this.$nextTick(() => {
        this.rerenderSqlPreview = true
        this.$nextTick(() => {
          // 防止多watch并发，出现重复创建编辑器
          if (this.sqlPreviewEditor != null) {
            return
          }
          const sql = this.$refs.tableSetting ? this.$refs.tableSetting.__getSql().sql : null
          if (sql != null && sql !== '') {
            this.sqlPreviewEditor = monaco.editor.create(
              document.querySelector('.sql-preview-editor'),
              {
                lineNumbers: "off",
                value: sql,
                language: 'sql',
                readOnly: true,
                overflowWidgetsDomNode: null,
                automaticLayout: false,
                selectionHighlight: false,
                smartSelect: false,
                disableLayerHinting: true,
                cursorStyle: 'underline-thin',
                minimap: {
                  enabled: false
                }
              }
            )
          }
        })
      })
    },
    // 打开SQL预览窗口
    openSqlPreviewWindow () {
      if (this.mainTable == null) {
        return
      }
      this.model.__visibleSQLPreviewWindow = true
    },
    // 删除表
    __deleteTable (table) {
      // 找到表
      const tableIndex = this.model.tables.findIndex(t => t.id === table.id)
      let promise = Promise.resolve()
      if (table.type === 'MAIN' && this.model.tables.length > 1) {
        promise = this.deleteConfirm(`删除主表会删除所有的子表及关联关系，确认删除嘛？`)
      }
      promise
        .then(() => {
          // 删除主表，清空一切
          if (table.type === 'MAIN') {
            // 从设计器中删除所有表
            for (const t of this.model.tables) {
              MD.deleteTable(t)
            }
            this.model.tables = []
            this.model.joins = []
            this.model.aggregates = []
            this.$emit('change')
            return
          }
          // 删除join关系
          this.model.joins = this.model.joins.filter(join => {
            if (join.table.id === table.id) {
              return false
            }
            if (join.targetTable.id === table.id) {
              return false
            }
            return true
          })
          // 删除聚合关系
          this.model.aggregates = this.model.aggregates.filter(agg => {
            if (agg.table.id === table.id) {
              return false
            }
            if (agg.targetTable.id === table.id) {
              return false
            }
            return true
          })
          // 删除table
          MD.deleteTable(table)
          this.model.tables.splice(tableIndex, 1)
          this.$emit('change')
        })
        .catch(() => {})
    },
    // 删除线
    __deleteLine ({ table, targetTable, field, targetField }) {
      // 查找对应join
      const joinIndex = this.model.joins.findIndex(join => {
        return join.table.id === table.id && join.targetTable.id === targetTable.id
      })
      // 删除join线
      if (joinIndex !== -1) {
        const join = this.model.joins[joinIndex]
        // 找到对应的on
        const onIndex = join.ons.findIndex(on => {
          return on.field.name === field.name && targetField.name === targetField.name
        })
        if (onIndex !== -1) {
          join.ons.splice(onIndex, 1)
        }
        // 如果没有了关联关系，则删除join
        if (join.ons.length === 0) {
          this.model.joins.splice(joinIndex, 1)
        }
      }
      // 删除聚合线
      const aggIndex = this.model.aggregates.findIndex(agg => {
        return agg.table.id === table.id &&
          agg.targetTable.id === targetTable.id &&
          agg.field.name === field.name &&
          agg.targetField.name === targetField.name
      })
      this.model.aggregates.splice(aggIndex, 1)
      this.$emit('change')
    },
    // 添加join关系
    __addJoinLine ({ table, targetTable, field, targetField }) {
      // 查找JOIN关系是否已存在
      let join = this.model.joins.find(
        r => r.table.id === table.id &&
          r.targetTable.id === targetTable.id
      )
      // 不存在JOIN关系，则添加JOIN关系
      if (join == null) {
        join = {
          table,
          targetTable,
          joinType: 'INNER JOIN',
          relation: 'ONE-TO-ONE',
          ons: []
        }
        this.model.joins.push(join)
      }
      // 添加ON条件
      join.ons.push({
        field,
        targetField,
        relation: 'AND'
      })
    },
    // 添加聚合线
    __addAggregateLine ({ table, targetTable, field, targetField }) {
      let aggregate = this.model.aggregates.find(
        r => r.table.id === table.id &&
          r.targetTable.id === targetTable.id &&
          (r.field.name === field.name || targetField.name === targetField.name)
      )
      if (aggregate == null) {
        this.model.aggregates.push({
          table: table,
          targetTable: targetTable,
          field: field,
          targetField: targetField,
          function: 'COUNT'
        })
      }
    },
  },
  mounted () {
    MD = new ModelDesigner('.stage')
    // 初始化设计器
    MD.createBackground()
    MD.createPreview('.preview-stage', 200, 150)

    // 绑定change事件
    MD.on('change', () => {
      // 触发change事件，保存模型数据
      this.$emit('change')
    })

    // 绑定创建关联线事件
    MD.on('line:created', ({ table, targetTable, field, targetField }) => {
      // 添加关联线
      if (this.model.__lineType === 'join') {
        this.__addJoinLine({ table, targetTable, field, targetField })
      }
      // 如果为聚合函数关联
      if (this.model.__lineType === 'aggregate') {
        this.__addAggregateLine({ table, targetTable, field, targetField })
      }
      // 刷新SQL
      this.refreshSQL()
      this.$emit('change')
    })

    // 绑定全局点击
    MD.on('stage:click', (e) => {
      // 关闭SQL查看，添加this.model判断，避免没有模型选中时报错
      if (e.target.nodeType === 'Stage' && this.model) {
         this.model.__visibleSQLPreviewWindow = false
      }
    })

    // 绑定创建关联线失败事件
    MD.on('line:create:error', (err) => {
      this.$tip.warning(err.message)
    })

    // 删除表事件
    MD.on('table:delete', ({ table }) => {
      this.__deleteTable(table)
      this.refreshSQL()
    })
    // 删除关联线事件
    MD.on('line:deleted', ({ table, targetTable, field, targetField }) => {
      this.__deleteLine({ table, targetTable, field, targetField })
      this.refreshSQL()
    })
  }
}
</script>

<style scoped lang="scss">
.designer-v2 {
  width: 100%;
  height: 100%;
  overflow: auto;
  // 预览
  .preview-wrap {
    background-color: rgba(255,255,255, .8);
    border-radius: 10px;
    position: absolute;
    right: 30px;
    box-shadow: 0 0 10px -5px #999;
    h2 {
      font-weight: normal;
      font-size: 12px;
      color: #999;
      position: absolute;
      bottom: 10px;
      right: 10px;
    }
  }
  // 关系预览
  .stage-preview-wrap {
    top: 20px;
    width: 200px;
    height: 150px;
  }
  // sql预览
  .sql-preview-wrap {
    top: 190px;
    width: 200px;
    height: 700px;
    // sql预览编辑器
    .sql-preview-editor {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      :deep(.monaco-editor) {
        background-color: transparent !important;
        .margin, .scrollbar {
          display: none;
        }
        .decorationsOverviewRuler {
          display: none !important;
        }
        .monaco-editor-background {
          background-color: transparent !important;
        }
        .view-line {
          transform: scale(0.5) translateX(-200px);
          user-select: none;
        }
        .editor-scrollable {
          left: 10px !important;
        }
        .cursor {
          display: none !important;
        }
      }
    }
    // sql预览蒙板，盖住编辑器，避免不适操作
    .sql-preview-panel {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 10px;
      z-index: 2;
      transition: all ease .15s;
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
        cursor: pointer;
      }
    }
  }
}
</style>
