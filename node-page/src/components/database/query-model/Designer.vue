<template>
  <!-- 提醒和创建虚拟表 -->
  <div
    v-if="model.tables.length === 0"
    class="empty-tip"
    @dragover.prevent
    @drop="handleDrop($event, 1)"
  >
    <div class="wrap">
      <p>{{$t('database.dragTip')}}</p>
      <p>{{$t('common.or')}}</p>
      <p><em @click="confirmCreateVirtualTable">{{$t('database.createVirtualTableTip')}}</em></p>
    </div>
  </div>
  <div class="stage-wrap" tabindex="-1" @keyup.delete="handleDelete">
    <v-stage
      v-if="rendered"
      ref="stage"
      :config="configKonva"
      @mouseup="$refs.stage.getNode().draggable(true)"
      @click="globalClick"
    >
      <Table
        v-for="table in model.tables"
        :ref="table.id"
        :key="table.name"
        :field-height="fieldHeight"
        :x="table.x"
        :y="table.y"
        :table="table"
        :relations="model.joins"
        :selected="model.selectedTableId === table.id"
        @dragmove="moveTable"
        @field:mousedown="handleFieldMouseDown"
        @field:mouseup="handleFieldMouseUp"
        @table:select="handleTableSelect"
        @table:preview="handleTablePreview"
      />
      <v-layer>
        <RelationLine
          v-for="line in relationLines"
          :key="line.id"
          :line-type="line.type"
          :start="line.start"
          :end="line.end"
          :selected="model.selectedLineId === line.id"
          @select="handleLineSelect(line)"
          @unselect="model.selectedLineId = null"
        />
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
import RelationLine from "./RelationLine.vue";
import Table from "./Table.vue";
import {generateId} from "../../../utils/generator";

export default {
  name: "QueryModelDesigner",
  components: {Table, RelationLine},
  props: {
    model: {},
    fieldHeight: {
      default: 30
    }
  },
  data () {
    return {
      rendered: true,
      configKonva: {
        // 设计区宽度
        width: 1260,
        // 设计区高度
        height: 1000,
        draggable: true
      },
      relationLines: [],
      // 拖动关联时的数据
      relationRuntime: {
        table: null,
        field: null,
        targetTable: null,
        targetField: null
      }
    }
  },
  computed: {
    tableLength () {
      return this.model.tables.length
    },
    // 重新渲染因素
    reRenderFactors () {
      return [this.tableLength, this.model]
    }
  },
  watch: {
    reRenderFactors () {
      this.render()
    }
  },
  methods: {
    // 处理删除
    handleDelete () {
      // 删除线
      if (this.model.selectedLineId != null) {
        this.__deleteLine()
        return
      }
      // 删除表
      if (this.model.selectedTableId != null) {
        this.__deleteTable()
      }
    },
    // 全局点击
    globalClick (e) {
      // 如果点击的是空白部分，则清空选择
      if (e.target.nodeType === 'Stage') {
        this.model.selectedTableId = null
        this.model.previewTableId = null
        this.model.selectedLineId = null
      }
    },
    // 移动表
    moveTable () {
      for (const table of this.model.tables) {
        const position = this.$refs[table.id][0].getNode().getAbsolutePosition()
        table.x = position.x
        table.y = position.y
      }
      this.computeRelations()
    },
    // 计算关联线
    computeRelations () {
      this.relationLines = []
      // 计算join关系线
      for (const join of this.model.joins) {
        const table = this.model.tables.find(t => t.id === join.table.id)
        const targetTable = this.model.tables.find(t => t.id === join.targetTable.id)
        for (const on of join.ons) {
          const startPosition = this.__getFieldPosition(table, on.field)
          const endPosition = this.__getFieldPosition(targetTable, on.targetField, false)
          if (startPosition == null || endPosition == null) {
            continue
          }
          this.relationLines.push({
            id: generateId(),
            start: startPosition,
            end: endPosition,
            type: 'join',
            table: join.table,
            field: on.field,
            targetTable: join.targetTable,
            targetField: on.targetField
          })
        }
      }
      // 计算聚合关系线
      for (const aggregate of this.model.aggregates) {
        const startPosition = this.__getFieldPosition(aggregate.table, aggregate.field)
        const endPosition = this.__getFieldPosition(aggregate.targetTable, aggregate.targetField, false)
        if (startPosition == null || endPosition == null) {
          continue
        }
        this.relationLines.push({
          id: generateId(),
          start: startPosition,
          end: endPosition,
          type: 'aggregate',
          table: aggregate.table,
          field: aggregate.field,
          targetTable: aggregate.targetTable,
          targetField: aggregate.targetField
        })
      }
    },
    // 处理字段按下
    handleFieldMouseDown ({ table, field }) {
      // 禁用stage拖动，用于实现字段拖动关联
      const stageNode = this.$refs.stage.getNode()
      stageNode.draggable(false)
      this.relationRuntime.table = table
      this.relationRuntime.field = field
    },
    // 处理字段按下弹起（添加字段关联）
    handleFieldMouseUp ({ table, field }) {
      if (this.relationRuntime.table == null) {
        return
      }
      // 开启stage拖动，用于恢复整体拖动
      const stageNode = this.$refs.stage.getNode()
      stageNode.draggable(true)
      // 记录结束表字段
      this.relationRuntime.targetTable = table
      this.relationRuntime.targetField = field
      // 如果开始表和结束表是同一个，则不做关联操作
      if (this.relationRuntime.table.id === this.relationRuntime.targetTable.id) {
        return
      }
      // 添加关联
      if (this.model.lineType === 'join') {
        this.__addJoinRelation()
        this.$emit('change')
        return
      }
      // 如果为聚合函数关联
      if (this.model.lineType === 'aggregate') {
        this.__addAggregate()
        this.$emit('change')
      }
    },
    // 处理表格选中
    handleTableSelect (tableId) {
      this.model.selectedTableId = tableId
      this.model.selectedLineId = null
      this.model.previewTableId = null
    },
    // 选中行
    handleLineSelect (line) {
      this.model.selectedLineId = line.id
      this.model.selectedTableId = null
      this.model.previewTableId = null
    },
    // 预览表
    handleTablePreview (tableId) {
      this.model.previewTableId = tableId
    },
    // stage拖拽放下
    handleDrop (e, a) {
      const stage = this.$refs.stage.getNode()
      stage.setPointersPositions(e);
      const position = stage.getPointerPosition()
      const size = {
        width: 200,
        height: (this.model.dragData.fields.length + 1) * this.fieldHeight
      }
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
        x: position.x - size.width / 2,
        y: position.y - size.height / 2,
        // 增加设计器元素ID
        id: generateId(),
        // 添加joins，用于存放join关系
        joins: []
      }
      this.model.tables.push(newTable)
      this.$emit('change')
    },
    // 添加虚拟表
    confirmCreateVirtualTable () {
      const size = {
        width: 200,
        height: this.fieldHeight
      }
      const newTable = {
        // 增加设计器元素ID
        id: generateId(),
        name: this.model.name,
        alias: this.model.name,
        comment: this.model.comment,
        ...size,
        // 第一个表标记为主表
        type: 'MAIN',
        // 标记为虚拟表
        isVirtual: true,
        x: 100,
        y: 100,
        // 添加joins，用于存放join关系
        joins: [],
        // 添加aggregates，用于存放聚合列
        aggregates: []
      }
      newTable.fields = this.__getVirtualTableDefaultFields(newTable)
      this.model.tables.push(newTable)
      this.$emit('change')
    },
    // 渲染
    render () {
      this.rendered = false
      this.$nextTick(() => {
        this.rendered = true
        this.$nextTick(() => {
          // 采用DOM方式为stage绑定拖拽放下事件
          const stage = this.$refs.stage.getNode()
          const container = stage.container()
          container.addEventListener('dragover', function (e) {
            e.preventDefault(); // !important
          });
          // 放下时增加表
          container.addEventListener('drop', (e) => {
            e.preventDefault();
            this.handleDrop(e, 2)
          })
          this.computeRelations()
        })
      })
    },
    // 获取虚拟表默认字段
    __getVirtualTableDefaultFields (table) {
      const fields = [
        {
          name: 'field1',
          alias: 'field1',
          type: 'int',
          length: 0,
          decimal: 0,
          required: false,
          isPrimaryKey: false,
          isAutoIncrement: false,
          comment: 'Virtual field 1',
          isVirtual: true,
          visible: true,
          table
        },
        {
          name: 'field2',
          alias: 'field2',
          type: 'int',
          length: 0,
          decimal: 0,
          required: false,
          isPrimaryKey: false,
          isAutoIncrement: false,
          comment: 'Virtual field 2',
          isVirtual: true,
          visible: true,
          table
        },
        {
          name: 'field3',
          alias: 'field3',
          type: 'int',
          length: 0,
          decimal: 0,
          required: false,
          isPrimaryKey: false,
          isAutoIncrement: false,
          comment: 'Virtual field 3',
          isVirtual: true,
          visible: true,
          table
        }
      ]
      return JSON.parse(JSON.stringify(fields))
    },
    // 删除线
    __deleteLine () {
      // 查找线条信息
      const line = this.relationLines.find(line => line.id === this.model.selectedLineId)
      // 删除join线
      if (line.type === 'join') {
        // 查找对应join
        const joinIndex = this.model.joins.findIndex(join => {
          return join.table.id === line.table.id && join.targetTable.id === line.targetTable.id
        })
        const join = this.model.joins[joinIndex]
        // 找到对应的on
        const onIndex = join.ons.findIndex(on => {
          return on.field.name === line.field.name && on.targetField.name === line.targetField.name
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
      else {
        // 查询聚合
        const aggIndex = this.model.aggregates.findIndex(agg => {
          return agg.table.id === line.table.id &&
            agg.targetTable.id === line.targetTable.id &&
            agg.field.name === line.field.name &&
            agg.targetField.name === line.targetField.name
        })
        this.model.aggregates.splice(aggIndex, 1)
      }
      this.model.selectedLineId = null
      this.$emit('change')
      this.render()
    },
    // 删除表
    __deleteTable () {
      // 找到表
      const tableIndex = this.model.tables.findIndex(t => t.id === this.model.selectedTableId)
      const table = this.model.tables[tableIndex]
      let promise = Promise.resolve()
      if (table.type === 'MAIN' && this.model.tables.length > 1) {
        promise = this.deleteConfirm(`Deleting the main table will delete all the schedules and associations. Are you sure to delete it?`)
      }
      promise
        .then(() => {
          // 删除主表，清空一切
          if (table.type === 'MAIN') {
            this.model.tables = []
            this.model.joins = []
            this.model.aggregates = []
            this.$emit('change')
            return
          }
          // 删除join关系
          this.model.joins = this.model.joins.filter(join => {
            if (join.table.id === this.model.selectedTableId) {
              return false
            }
            if (join.targetTable.id === this.model.selectedTableId) {
              return false
            }
            return true
          })
          // 删除聚合关系
          this.model.aggregates = this.model.aggregates.filter(agg => {
            if (agg.table.id === this.model.selectedTableId) {
              return false
            }
            if (agg.targetTable.id === this.model.selectedTableId) {
              return false
            }
            return true
          })
          // 删除table
          this.model.tables.splice(tableIndex, 1)
          this.$emit('change')
        })
        .catch(() => {})
    },
    // 添加join关系
    __addJoinRelation () {
      // 如果开始表和结束表是同一个，则不做关联操作
      if (this.relationRuntime.table.id === this.relationRuntime.targetTable.id) {
        this.$tip.warning('The join relationship cannot be created.')
        return
      }
      // 添加关联
      let join = this.model.joins.find(
        r => r.table.id === this.relationRuntime.table.id &&
          r.targetTable.id === this.relationRuntime.targetTable.id
      )
      if (join == null) {
        join = {
          table: this.relationRuntime.table,
          targetTable: this.relationRuntime.targetTable,
          joinType: 'INNER JOIN',
          relation: 'ONE-TO-ONE',
          ons: []
        }
        this.model.joins.push(join)
      }
      join.ons.push({
        field: this.relationRuntime.field,
        targetField: this.relationRuntime.targetField,
        relation: 'AND'
      })
      this.computeRelations()
    },
    // 添加聚合关系
    __addAggregate () {
      // 如果开始表和结束表是同一个，则不做关联操作
      if (this.relationRuntime.table.id === this.relationRuntime.targetTable.id) {
        this.$tip.warning('The aggregate relationship cannot be created.')
        return
      }
      // 添加聚合
      let aggregate = this.model.aggregates.find(
        r => r.table.id === this.relationRuntime.table.id &&
          r.targetTable.id === this.relationRuntime.targetTable.id &&
          (r.field.name === this.relationRuntime.field.name || r.targetField.name === this.relationRuntime.targetField.name)
      )
      if (aggregate == null) {
        aggregate = {
          table: this.relationRuntime.table,
          targetTable: this.relationRuntime.targetTable,
          field: this.relationRuntime.field,
          targetField: this.relationRuntime.targetField,
          function: 'COUNT'
        }
        this.model.aggregates.push(aggregate)
      }
      this.computeRelations()
    },
    // 获取字段坐标
    __getFieldPosition (table, field, withWidth=true) {
      const stageNode = this.$refs.stage.getNode()
      const stagePosition = stageNode.getAbsolutePosition()
      let fieldIndex = table.fields.findIndex(f => f.visible && f.name === field.name)
      if (fieldIndex === -1) {
        return null
      }
      let staticFieldIndex = fieldIndex
      // 计算出前面隐藏的字段，每隐藏一个，坐标-1，最终才是字段真正展示的坐标
      for (let i = 0; i < staticFieldIndex; i++) {
        if (!table.fields[i].visible) {
          fieldIndex--
        }
      }
      if (fieldIndex === -1) {
        return null
      }
      const x = table.x + (withWidth ? 200 : 0) - stagePosition.x
      const y = table.y + this.fieldHeight + (fieldIndex + 1) * this.fieldHeight - 15 - stagePosition.y
      return { x, y }
    }
  },
  mounted() {
    this.render()
  }
}
</script>

<style scoped lang="scss">
.empty-tip {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  .wrap {
    width: 500px;
    padding: 20px;
    box-sizing: border-box;
    p {
      font-size: var(--font-size-middle);
      text-align: center;
      line-height: 25px;
      em {
        color: var(--primary-color-match-2);
        font-style: normal;
        text-decoration: underline;
        cursor: pointer;
      }
    }
    .el-table {
      margin-top: 20px;
    }
    .opera {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
  }
}
.stage-wrap {
  &:focus {
    outline: none;
  }
}
</style>
