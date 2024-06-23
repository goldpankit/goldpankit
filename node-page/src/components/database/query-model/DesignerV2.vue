<template>
  <div
    class="designer-v2"
    @dragover.prevent
    @drop="handleDrop($event, 1)"
  >
    <div class="stage"></div>
    <div class="preview-stage"></div>
  </div>
</template>

<script>
import ModelDesigner from './model-designer'
import { generateId } from '@/utils/generator'

let MD = null
export default {
  name: 'DesignerV2',
  props: {
    model: {}
  },
  watch: {
    model () {
      this.init()
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
              targetTable: join.targetTable,
              isInit: true
            })
          }
        }
        // 重新绘制预览
        MD.redrawPreview()
      })
    },
    // 拖拽表
    handleDrop (e) {
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
    MD.on('createNewLine', ({ table, targetTable, field, targetField }) => {
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
  }
}
</script>

<style scoped lang="scss">
.designer-v2 {
  width: 100%;
  height: 100%;
  overflow: auto;
  .preview-stage {
    background-color: rgba(0,0,0,.2);
    border-radius: 10px;
    position: absolute;
    top: 20px;
    right: 30px;
  }
}
</style>
