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
      <TableSetting v-if="mainTable != null" v-show="false" ref="tableSetting" :table="mainTable" :joins="mainTableJoins" :aggregates="mainTableAggregates"/>
      <div v-if="rerenderSqlPreview" class="sql-preview-editor"></div>
      <div class="sql-preview-panel" @click="openSqlPreviewWindow"></div>
    </div>
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
    model () {
      this.init()
    },
    mainTable () {
      this.refreshSQL()
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
        // 添加线
        for (const join of this.model.joins) {
          for (const on of join.ons) {
            MD.createLine({
              field: on.field,
              targetField: on.targetField,
              table: join.table,
              targetTable: join.targetTable
            })
          }
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
      const newTable = {
        ...this.model.dragData,
        // 字段
        fields: this.model.dragData.fields.map(f => {
          return {
            ...f,
            alias: f.name,
            visible: true,
            isVirtual: false
          }
        }),
        // 非虚拟表
        isVirtual: false,
        // 第一个表标记为主表
        type: this.model.tables.length === 0 ? 'MAIN' : 'SUB',
        x: tableX,
        y: tableY,
        // 增加设计器元素ID
        id: generateId(),
        // 添加joins，用于存放join关系
        joins: []
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
    openSqlPreviewWindow () {
      if (this.mainTable == null) {
        return
      }
      this.model.previewTableId = this.mainTable.id
    }
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
      // 刷新SQL
      this.refreshSQL()
      this.$emit('change')
    })

    // 绑定全局点击
    MD.on('stage:click', (e) => {
      // 关闭SQL查看
      if (e.target.nodeType === 'Stage') {
        this.model.previewTableId = null
      }
    })

    // 绑定创建关联线失败事件
    MD.on('line:create:error', (err) => {
      this.$tip.warning(err.message)
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
