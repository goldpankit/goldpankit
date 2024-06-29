<template>
  <ul class="joins" :style="{'padding-left': indent}">
    <li v-for="(join, index) in joins" :key="index">
      <SQLLine>
        <SQLLineKeywordSelect
          v-model="join.joinType"
          width="105px"
          :data="['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'OUTER JOIN']"
          class="keyword"
          @change="handleChange($event, join)"
        />
        <span>{{join.targetTable.name}}</span>
        <DynamicWidthInput v-model="join.targetTable.alias" @change="emitTableAliasChange(join.targetTable, $event)"/>
        <em>ON</em>
        <SQLLineKeywordSelect
          v-model="join.relation"
          width="130px"
          :data="['ONE-TO-ONE', 'ONE-TO-MANY', 'MANY-TO-ONE']"
          class="relation"
          @change="handleChange"
        />
      </SQLLine>
      <ul class="join-ons">
        <SQLLine v-for="(on,index) in join.ons" :key="index" indent="20">
          <SQLLineKeywordSelect
            v-if="index !== 0"
            v-model="on.relation"
            :data="['AND', 'OR']"
            width="45px"
            @change="handleChange"
          />
          <DynamicWidthInput v-model="on.table.alias" @change="emitTableAliasChange(on.table, $event)"/>
          <span>.</span>
          <span>{{on.field.name}}</span>
          <span>=</span>
          <DynamicWidthInput v-model="on.targetTable.alias" @change="emitTableAliasChange(on.targetTable, $event)"/>
          <span>.</span>
          <span>{{on.targetField.name}}</span>
        </SQLLine>
      </ul>
    </li>
  </ul>
</template>

<script>

import SQLLineKeywordSelect from "./SQLLineKeywordSelect.vue";
import SQLLine from "./SQLLine.vue";
import DynamicWidthInput from "../../common/DynamicWidthInput.vue";

export default {
  name: 'SQLJoin',
  components: {DynamicWidthInput, SQLLine, SQLLineKeywordSelect},
  props: {
    // 表
    table: {
      required: true
    },
    // JOIN关系
    joins: {
      required: true
    },
    // 缩进级别
    indentLevel: {
      default: 1
    }
  },
  computed: {
    indent () {
      return `${(this.indentLevel -1) * 20}px`
    }
  },
  methods: {
    // 修改设置
    handleChange (value) {
      this.$emit('change', value)
    },
    // 触发表别名修改事件
    emitTableAliasChange (table, value) {
      this.$emit('table:alias:change', {
        table,
        value
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
