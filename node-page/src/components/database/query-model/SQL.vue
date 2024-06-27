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
        <SQLJoin :indent-level="3" :joins="repairedJoins" :table="getAggregate(field).targetTable"/>
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
    <SQLJoin :joins="repairedJoins" :table="table" @change="handleChange"/>
  </div>
</template>

<script>

import SQLLineKeywordSelect from "./SQLLineKeywordSelect.vue";
import SQLLine from "./SQLLine.vue";
import DynamicWidthInput from "../../common/DynamicWidthInput.vue";
import SQLJoin from "./SQLJoin.vue";

export default {
  name: 'SQL',
  components: {SQLJoin, DynamicWidthInput, SQLLine, SQLLineKeywordSelect},
  props: {
    // 模型
    model: {
      required: true
    },
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
    /**
     * 修复表joins关系，使得join.table2一直为待关联的表，且table2在已修复的joins中不可重复（注意这里的重复指的是table.id不重复，使得可以关联多张相同的表）
     * e.g A.a1 => B.b1, B.b2 => C.c1，此时应得到joins为[{ table1:A, table2:B }, {table1: B, table2: C}]，可的语句为JOIN B, JOIN C
     * @returns {*}
     */
    repairedJoins () {
      // 已修复的join
      const repairedJoins = []
      /*
      如果joins中没有主表，则视为没有关联关系
      e.g 存在主表M1，子表S1和S2，S1和S2建立了关联关系，但并没有与M1建立关联关系，此时不产生SQL语句。因为SQL语句展示的是当前表的关联关系
      */
      if (!this.joins.find(join => join.table1.id === this.table.id || join.table2.id === this.table.id)) {
        return []
      }
      for (const join of this.joins) {
        // 此处只需复制join的引用，需要保留join内部对象的引用，避免表和字段发生变化时未能及时修改join中的信息
        const copyJoin = { ...join }
        // 主表关联了子表，不做处理
        if (join.table1.id === this.table.id) {
          repairedJoins.push(copyJoin)
          continue
        }
        // 子表关联了主表，则table2为主表，则将table2变为table1（此时table1为子表）
        if (join.table2.id === this.table.id) {
          const mainTable = copyJoin.table1
          copyJoin.table2 = copyJoin.table1
          copyJoin.table1 = mainTable
          repairedJoins.push(copyJoin)
          continue
        }
        // 子表关联了子表，则判断已修复的joins中，是否存在当前table2，如果存在，则将table1作为table2
        const existJoin = repairedJoins.find(join => join.table2.id === copyJoin.table2.id)
        if (existJoin) {
          const table2 = copyJoin.table1
          copyJoin.table2 = copyJoin.table1
          copyJoin.table1 = table2
        }
        repairedJoins.push(copyJoin)
      }
      return repairedJoins
    },
    // 展示字段
    visibleFields () {
      let fields = new Set()
      // 当前表的字段
      for (const field of this.table.fields) {
        field.table = this.table
        fields.add(field)
      }
      // join表字段
      for (const join of this.repairedJoins) {
        for (const field of join.table1.fields) {
          field.table = join.table1
          fields.add(field)
        }
        for (const field of join.table2.fields) {
          field.table = join.table2
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
      const targetTable = this.model.tables.find(t => t.id === table.id)
      // 主表字段，不做处理
      if (targetTable.type === 'MAIN') {
        this.$emit('field:change')
        return
      }
      // 子表字段，则自动更新字段别名
      for (const field of targetTable.fields) {
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
