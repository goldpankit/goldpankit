<template>
  <div class="table-setting" :class="{ visible: table != null }">
    <div class="toolbar">
      <el-button ico="Edit" @click="edit">Edit</el-button>
      <el-button type="primary">Execute</el-button>
    </div>
    <div class="wrap" v-if="table != null">
      <SQLLine type="select" @field:create="createVirtualField"><em>SELECT</em></SQLLine>
      <template v-for="(field,index) in table.fields">
        <template v-if="getAggregate(field)">
          <SQLLine indent="20" :visible="field.visible">(</SQLLine>
          <SQLLine indent="40" :visible="field.visible"><em>SELECT</em></SQLLine>
          <SQLLine indent="60" :visible="field.visible">
            <DynamicWidthInput v-model="getAggregate(field).function"/>
            <span>(</span>
            <DynamicWidthInput v-model="getAggregate(field).targetTable.alias"/>
            <span>.</span>
            <span>{{getAggregate(field).targetField.name}}</span>
            <span>)</span>
          </SQLLine>
          <SQLLine indent="40" :visible="field.visible">
            <em>FROM</em>
            <span>{{getAggregate(field).targetTable.name}}</span>
            <DynamicWidthInput v-model="getAggregate(field).targetTable.alias"/>
          </SQLLine>
          <SQLLine
            indent="20"
            :type="table.isVirtual ? 'virtual-field': 'field'"
            v-model:visible="field.visible"
            @field:delete="deleteVirtualField(index)"
          >
            <span>)</span>
            <em>AS</em>
            <span>{{field.name}}{{table.fields.length === index + 1 ? '' : ','}}</span>
            <template v-if="table.isVirtual">
              <span class="comment">#</span>
              <DynamicWidthInput v-model="field.type" class="comment"/>
              <DynamicWidthInput v-model="field.comment" class="comment"/>
            </template>
          </SQLLine>
        </template>
        <SQLLine
          v-else
          :key="field.name"
          :type="table.isVirtual ? 'virtual-field': 'field'"
          v-model:visible="field.visible"
          indent="20"
          @field:delete="deleteVirtualField(index)"
        >
          <DynamicWidthInput v-model="table.alias"/>
          <span>.</span>
          <span>{{field.name}}</span>
          <em>AS</em>
          <span>{{field.name}}{{table.fields.length === index + 1 ? '' : ','}}</span>
          <template v-if="table.isVirtual">
            <span class="comment">#</span>
            <DynamicWidthInput v-model="field.type" class="comment"/>
            <DynamicWidthInput v-model="field.comment" class="comment"/>
          </template>
        </SQLLine>
      </template>
      <SQLLine v-if="!table.isVirtual">
        <em>FROM</em>
        <span>{{table.name}}</span>
        <em>AS</em>
        <DynamicWidthInput v-model="table.alias"/>
      </SQLLine>
      <ul class="joins">
        <li v-for="join in tableJoins">
          <SQLLine class="sql-line">
            <em>INNER JOIN</em>
            <span>{{join.joinTable.name}}</span>
            <DynamicWidthInput v-model="join.joinTable.alias"/>
            <em>ON</em>
            <span>#</span>
            <DynamicWidthInput v-model="join.relation" class="comment"/>
          </SQLLine>
          <ul class="join-ons">
            <SQLLine v-for="(on,index) in join.ons" indent="20">
              <DynamicWidthInput v-if="index !== 0" v-model="on.relationType"/>
              <DynamicWidthInput v-model="table.alias"/>
              <span>.</span>
              <span>{{on.startField.name}}</span>
              <span>=</span>
              <DynamicWidthInput v-model="join.joinTable.alias"/>
              <span>.</span>
              <span>{{on.endField.name}}</span>
            </SQLLine>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import SQLLine from "./SQLLine.vue";
import DynamicWidthInput from "../../common/DynamicWidthInput.vue";

export default {
  name: "TableSetting",
  components: {DynamicWidthInput, SQLLine},
  props: {
    // 表
    table: {
      required: true
    },
    // 表join信息
    tableJoins: {
      type: Array
    },
    // 聚合信息
    aggregates: {
      type: Array
    }
  },
  methods: {
    // 编辑
    edit () {
      console.log(this.$el.querySelector('.wrap').innerText)
    },
    // 创建虚拟字段
    createVirtualField () {
      this.table.fields.push({
        name: 'virtual1',
        type: 'int',
        comment: 'Virtual field 1'
      })
      this.$emit('field:change')
    },
    // 删除虚拟字段
    deleteVirtualField (index) {
      this.table.fields.splice(index, 1)
      this.$emit('field:change')
    },
    // 获取聚合语句
    getAggregate (field) {
      const aggregate = this.aggregates.find(agg => agg.field.name === field.name)
      if (aggregate == null) {
        return null
      }
      return aggregate
    }
  }
}
</script>

<style scoped lang="scss">
.table-setting {
  position: absolute;
  background: #fff;
  padding: 30px;
  top: 0;
  right: 0;
  height: 100%;
  width: 800px;
  flex-shrink: 0;
  overflow-y: auto;
  box-shadow: -2px 0 10px #333;
  transform: translateX(2000px);
  transition: all ease .3s;
  letter-spacing: 1px;
  .toolbar {
    display: flex;
    justify-content: flex-end;
  }
  &.visible {
    transform: translateX(0);
  }
}
</style>
