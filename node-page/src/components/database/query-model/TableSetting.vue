<template>
  <div class="table-setting" :class="{ visible: table != null }">
    <div class="wrap" v-if="table != null">
      <SQLLine><em>SELECT</em></SQLLine>
      <SQLLine v-for="(field,index) in table.fields" :key="field.name" type="field" indent="20">
        <DynamicWidthInput v-model="table.alias"/>
        <span>.</span>
        <span>{{field.name}}</span>
        <em>AS</em>
        <span>{{field.name}}{{table.fields.length === index + 1 ? '' : ','}}</span>
      </SQLLine>
      <SQLLine>
        <p><em>FROM</em> {{table.name}} <em>AS</em></p>
        <DynamicWidthInput v-model="table.alias"/>
      </SQLLine>
      <ul class="joins">
        <li v-for="join in tableJoins">
          <SQLLine class="sql-line">
            <em>INNER JOIN</em>
            <span>{{join.joinTable.name}}</span>
            <DynamicWidthInput v-model="join.joinTable.alias"/>
            <em>ON</em>
          </SQLLine>
          <ul class="join-ons">
            <SQLLine v-for="on in join.ons" indent="20">
              <DynamicWidthInput v-model="table.alias"/>
              <span>.</span>
              <span>{{on.startField}}</span>
              <span>=</span>
              <DynamicWidthInput v-model="join.joinTable.alias"/>
              <span>.</span>
              <span>{{on.endField}}</span>
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
  &.visible {
    transform: translateX(0);
  }
}
</style>
