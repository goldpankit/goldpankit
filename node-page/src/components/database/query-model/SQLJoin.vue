<template>
  <ul class="joins" :style="{'padding-left': indent}">
    <li v-for="join in currentTableJoins">
      <SQLLine>
        <SQLLineKeywordSelect
          v-model="join.joinType"
          :data="['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'OUTER JOIN']"
          class="keyword"
          style="width: 100px;"
          @change="handleChange"
        />
        <span class="hidden">{{join.joinType}}</span>
        <span>{{join.targetTable.name}}</span>
        <DynamicWidthInput v-model="join.targetTable.alias" @change="handleChange"/>
        <em>ON</em>
        <SQLLineKeywordSelect
          v-model="join.relation"
          :data="['ONE-TO-ONE', 'ONE-TO-MANY', 'MANY-TO-ONE']"
          class="relation"
          style="width: 115px;"
          @change="handleChange"
        />
      </SQLLine>
      <ul class="join-ons">
        <SQLLine v-for="(on,index) in join.ons" indent="20">
          <SQLLineKeywordSelect
            v-if="index !== 0"
            v-model="on.relation"
            :data="['AND', 'OR']"
            style="width:40px"
            @change="handleChange"
          />
          <DynamicWidthInput v-model="join.targetTable.alias" @change="handleChange"/>
          <span>.</span>
          <span>{{on.targetField.name}}</span>
          <span>=</span>
          <DynamicWidthInput v-model="join.table.alias" @change="handleChange"/>
          <span>.</span>
          <span>{{on.field.name}}</span>
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
  name: "SQLJoin",
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
    },
    // 获取到当前表的joins
    currentTableJoins () {
      return this.joins.filter(join => join.table.id === this.table.id)
    },
  },
  methods: {
    // 修改设置
    handleChange () {
      this.$emit('change')
    },
  }
}
</script>

<style scoped lang="scss">

</style>
