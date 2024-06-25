<template>
  <div class="sql">
    <!-- 查询语句 -->
    <SQLLine type="select" @field:create="createVirtualField"><em>SELECT</em></SQLLine>
    <!-- 字段列表 -->
    <template v-for="(field,index) in visibleFields">
      <!-- 聚合字段 -->
      <template v-if="getAggregate(field)">
        <SQLLine indent="20" :visible="field.visible">(</SQLLine>
        <SQLLine indent="40" :visible="field.visible"><em>SELECT</em></SQLLine>
        <SQLLine indent="60" :visible="field.visible">
          <SQLLineKeywordSelect
            v-model="getAggregate(field).function"
            :data="['COUNT', 'SUM', 'AVG', 'MAX', 'MIN']"
            :width="`${__getAggregateFunctionWidth(getAggregate(field).function)}px`"
            @change="handleChange"
          />
          <span class="hidden">{{getAggregate(field).function}}</span>
          <span>(</span>
          <DynamicWidthInput v-model="getAggregate(field).targetTable.alias" @change="handleChange"/>
          <span>.</span>
          <span>{{getAggregate(field).targetField.name}}</span>
          <span>)</span>
        </SQLLine>
        <!-- 聚合表 -->
        <SQLLine indent="40" :visible="field.visible">
          <em>FROM</em>
          <span>{{getAggregate(field).targetTable.name}}</span>
          <DynamicWidthInput v-model="getAggregate(field).targetTable.alias" @change="handleChange"/>
        </SQLLine>
        <!-- 聚合表JOIN -->
        <SQLJoin :indent-level="3" :joins="joins" :table="getAggregate(field).targetTable"/>
        <!-- 聚合表别名的等信息 -->
        <SQLLine
          indent="20"
          :type="field.isVirtual ? 'virtual-field': 'field'"
          v-model:visible="field.visible"
          @field:delete="deleteVirtualField(index)"
          @update:visible="fieldVisibleChange"
        >
          <span>)</span>
          <span>AS</span>
          <DynamicWidthInput v-model="field.alias"/>
          <span>{{visibleFields.length === index + 1 ? '' : ','}}</span>
          <!-- 虚拟字段展示类型和注释 -->
          <template v-if="field.isVirtual">
            <span class="comment">#</span>
            <DynamicWidthInput v-model="field.type" class="comment" @change="handleChange"/>
            <DynamicWidthInput v-model="field.comment" class="comment" @change="handleChange"/>
          </template>
        </SQLLine>
      </template>
      <!-- 非聚合字段 -->
      <SQLLine
        v-else
        :key="field.name"
        :type="field.isVirtual ? 'virtual-field': 'field'"
        v-model:visible="field.visible"
        indent="20"
        @field:delete="deleteVirtualField(index)"
        @update:visible="fieldVisibleChange"
      >
        <DynamicWidthInput v-model="field.table.alias" @change="handleTableAliasChange(field.table, $event)"/>
        <span>.</span>
        <!-- 非虚拟字段 -->
        <template v-if="!field.isVirtual">
          <span>{{field.name}}</span>
          <span>AS</span>
          <DynamicWidthInput v-model="field.alias" @change="handleChange"/>
          <span>{{visibleFields.length === index + 1 ? '' : ','}}</span>
        </template>
        <!-- 虚拟字段 -->
        <template v-else>
          <DynamicWidthInput :model-value="field.name" v-model:blur-model-value="field.name" @blur="handleChange"/>
          <span>AS</span>
          <DynamicWidthInput :model-value="field.alias" v-model:blur-model-value="field.alias" @blur="handleChange"/>
          <span>{{visibleFields.length === index + 1 ? '' : ','}}</span>
          <span class="comment">#</span>
          <DynamicWidthInput v-model="field.type" class="comment" @change="handleChange"/>
          <DynamicWidthInput v-model="field.comment" class="comment" @change="handleChange"/>
        </template>
      </SQLLine>
    </template>
    <SQLLine v-if="!table.isVirtual">
      <em>FROM</em>
      <span>{{table.name}}</span>
      <span>AS</span>
      <DynamicWidthInput v-model="table.alias" @change="handleChange"/>
    </SQLLine>
    <!-- JOIN语句 -->
    <SQLJoin :joins="joins" :table="table" @change="handleChange"/>
  </div>
</template>

<script>

import SQLLineKeywordSelect from "./SQLLineKeywordSelect.vue";
import SQLLine from "./SQLLine.vue";
import DynamicWidthInput from "../../common/DynamicWidthInput.vue";
import SQLJoin from "./SQLJoin.vue";

export default {
  name: "SQL",
  components: {SQLJoin, DynamicWidthInput, SQLLine, SQLLineKeywordSelect},
  props: {
    // 表
    table: {
      required: true
    },
    // JOIN关系
    joins: {
      required: true
    },
    // 聚合信息
    aggregates: {
      required: true
    }
  },
  computed: {
    // 获取到当前表的joins
    currentTableJoins () {
      return this.joins.filter(join => join.table.id === this.table.id)
    },
    // 展示字段
    visibleFields () {
      let fields = new Set()
      // 当前表的字段
      for (const field of this.table.fields) {
        field.table = this.table
        field.alias = field.alias || field.name
        fields.add(field)
      }
      // join表字段
      for (const join of this.joins) {
        // 不是当前表的join关系，不做处理
        if (join.table.id !== this.table.id) {
          continue
        }
        // 拿到join的表
        for (const field of join.targetTable.fields) {
          field.table = join.targetTable
          field.alias = field.alias || field.name
          fields.add(field)
        }
      }
      return [...fields]
    }
  },
  methods: {
    // 修改设置
    handleChange () {
      this.$emit('field:change')
    },
    // 修改了表别名，则同步字段别名
    handleTableAliasChange (table, { oldValue, newValue }) {
      for (const field of table.fields) {
        if (field.alias === `${oldValue}_${field.name}`) {
          field.alias = `${newValue}_${field.name}`
        }
      }
      this.$emit('field:change')
    },
    // 创建虚拟字段
    createVirtualField () {
      const newField = {
        name: 'virtual1',
        alias: 'virtual1',
        type: 'int',
        comment: '虚拟字段',
        isVirtual: true,
        visible: true
      }
      this.table.fields.push(newField)
      this.$emit('field:created', { field: newField })
      this.$emit('field:change')
    },
    // 获取字段聚合信息
    getAggregate (field) {
      const aggregate = this.aggregates.find(agg => agg.field.name === field.name)
      if (aggregate == null) {
        return null
      }
      return aggregate
    },
    // 字段显示改变
    fieldVisibleChange () {
      this.$emit('field:change')
    },
    // 删除虚拟字段
    deleteVirtualField (index) {
      const field = this.table.fields[index]
      this.table.fields.splice(index, 1)
      this.$emit('field:deleted', { index, field })
      this.$emit('field:change')
    },
    // 获取聚合函数宽度
    __getAggregateFunctionWidth (functionName) {
      const widths = {
        COUNT: 65,
        SUM: 44,
        AVG: 42,
        MAX: 44,
        MIN: 40
      }
      return widths[functionName]
    },
  }
}
</script>

<style scoped lang="scss">

</style>
