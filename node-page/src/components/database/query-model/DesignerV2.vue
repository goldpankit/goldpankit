<template>
  <div
    class="designer-v2"
    @dragover.prevent
    @drop="handleDrop($event, 1)"
  >
    <div class="stage"></div>
    <div class="preview-wrap stage-preview-wrap">
      <h2>关系预览</h2>
      <div class="preview-stage"></div>
    </div>
    <div class="preview-wrap sql-preview-wrap">
      <h2>SQL预览</h2>
      <TableSetting v-if="mainTable != null" v-show="false" ref="tableSetting" :table="mainTable" :joins="mainTableJoins" :aggregates="mainTableAggregates"/>
      <div class="sql-preview"></div>
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
      sqlPreviewEditor: null
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
    },
    mainTableJoins () {
      this.refreshSQL()
    }
  },
  methods: {
    // 初始化表
    init () {
      this.$nextTick(() => {
        MD.redraw()
        if (this.model == null) {
          return
        }
        console.log('模型数据', this.model)
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
        // 重新绘制预览
        MD.redrawPreview()
      })
    },
    // 拖拽表
    handleDrop (e) {
      if (this.model == null) {
        this.$tip.warning('请先选择或创建模型！')
        return
      }
      // 获取放下时的鼠标坐标
      MD.stage.setPointersPositions(e)
      const mousePos = MD.stage.getPointerPosition()
      // 获取到表信息
      const newTableGroup = MD.createTable(this.model.dragData, mousePos.x - 100, mousePos.y)
      // 重新绘制预览
      MD.redrawPreview()
      // 添加表数据
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
        x: newTableGroup.absolutePosition().x,
        y: newTableGroup.absolutePosition().y,
        // 增加设计器元素ID
        id: generateId(),
        // 添加joins，用于存放join关系
        joins: []
      }
      this.model.tables.push(newTable)
      this.$emit('change')
    },
    // 获取最新SQL语句
    refreshSQL () {
      this.$nextTick(() => {
        this.previewSql = this.$refs.tableSetting ? this.$refs.tableSetting.__getSql().sql : ''
        if (this.previewSql != null && this.previewSql !== '') {
          if (this.sqlPreviewEditor != null) {
            this.sqlPreviewEditor.destroy()
          }
          this.sqlPreviewEditor = monaco.editor.create(
            document.querySelector('.sql-preview-wrap .sql-preview'),
            {
              lineNumbers: "off",
              value: this.previewSql,
              language: 'sql',
              readOnly: true,
              theme: 'vs-dark',
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
    },
    openSqlPreviewWindow () {
      if (this.mainTable == null) {
        return
      }
      this.model.previewTableId = this.mainTable.id
    }
  },
  mounted () {
    MD = new ModelDesigner('.stage', 2000, 2000)
    // 初始化设计器
    MD.createBackground()
    MD.createPreview('.preview-stage')

    // 绑定change事件
    MD.on('change', () => {
      this.$emit('change')
    })

    // 绑定创建关联线事件
    MD.on('line:created', ({ table, targetTable, field, targetField }) => {
      let join = this.model.joins.find(
        r => r.table.id === table.id &&
          r.targetTable.id === targetTable.id
      )
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
      join.ons.push({
        field,
        targetField,
        relation: 'AND'
      })
      this.$emit('change')
    })

    // 绑定全局点击
    MD.on('stage:click', (e) => {
      // 关闭SQL查看
      if (e.target.nodeType === 'Stage') {
        this.model.previewTableId = null
      }
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
    background-color: rgba(0,0,0,.2);
    border-radius: 10px;
    position: absolute;
    right: 30px;
    h2 {
      font-size: 15px;
      color: #555;
      position: absolute;
      bottom: 10px;
      right: 10px;
    }
  }
  // 关系预览
  .stage-preview-wrap {
    top: 20px;
    width: 200px;
    height: 200px;
  }
  // sql预览
  .sql-preview-wrap {
    top: 240px;
    width: 200px;
    height: 700px;
    // sql预览编辑器
    .sql-preview {
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
    .sql-preview-panel {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      transition: all ease .15s;
      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
        cursor: pointer;
      }
    }
  }
}
</style>
