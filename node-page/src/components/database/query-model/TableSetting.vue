<template>
  <div class="table-setting" :class="{ visible: table != null }">
    <div class="toolbar">
      <el-button type="primary" class="button-copy" data-clipboard-text="Hello World" @click="copy">Copy</el-button>
      <el-button type="primary" @click="execute">Execute</el-button>
    </div>
    <div class="wrap" v-if="table != null">
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
              :style="`width: ${__getAggregateFunctionWidth(getAggregate(field).function)}px;`"
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
          <!-- 聚合表别名的等信息 -->
          <SQLLine
            indent="20"
            :type="field.isVirtual ? 'virtual-field': 'field'"
            v-model:visible="field.visible"
            @field:delete="deleteVirtualField(index)"
            @update:visible="fieldVisibleChange"
          >
            <span>)</span>
            <em>AS</em>
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
          <DynamicWidthInput v-model="field.table.alias" @change="handleChange"/>
          <span>.</span>
          <!-- 非虚拟字段 -->
          <template v-if="!field.isVirtual">
            <span>{{field.name}}</span>
            <em>AS</em>
            <DynamicWidthInput v-model="field.alias" @change="handleChange"/>
            <span>{{visibleFields.length === index + 1 ? '' : ','}}</span>
          </template>
          <!-- 虚拟字段 -->
          <template v-else>
            <DynamicWidthInput :model-value="field.name" v-model:blur-model-value="field.name" @blur="handleChange"/>
            <em>AS</em>
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
        <em>AS</em>
        <DynamicWidthInput v-model="table.alias" @change="handleChange"/>
      </SQLLine>
      <ul class="joins">
        <li v-for="join in tableJoins">
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
    </div>
    <SQLPreview ref="sqlPreview"/>
  </div>
</template>

<script>
import {mapState} from "vuex";
import SQLLine from "./SQLLine.vue";
import DynamicWidthInput from "../../common/DynamicWidthInput.vue";
import SQLLineKeywordSelect from "./SQLLineKeywordSelect.vue";
import SQLPreview from "./SQLPreview.vue";
import {execSql, formatSql} from "../../../api/database.util";

export default {
  name: "TableSetting",
  components: {SQLPreview, SQLLineKeywordSelect, DynamicWidthInput, SQLLine},
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
  computed: {
    ...mapState(['currentDatabase']),
    // 展示字段
    visibleFields () {
      let fields = new Set()
      for (const field of this.table.fields) {
        field.table = this.table
        field.alias = field.name
        fields.add(field)
      }
      for (const join of this.tableJoins) {
        for (const field of join.table.fields) {
          field.table = join.table
          field.alias = field.name
          fields.add(field)
        }
        for (const field of join.targetTable.fields) {
          field.table = join.targetTable
          field.alias = field.name
          fields.add(field)
        }
      }
      return [...fields]
    }
  },
  methods: {
    // 拷贝语句
    copy () {
      formatSql({
        sql: this.__getSql()
      })
        .then(sql => {
          return navigator.clipboard.writeText(sql)
        })
        .then(() => {
          this.$tip.success('Copy successfully.')
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 执行语句
    execute () {
      const sql = this.__getSql()
      console.log('sql', sql)
      execSql({
        database: this.currentDatabase,
        sql
      })
        .then(data => {
          this.$refs.sqlPreview.open(data)
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 创建虚拟字段
    createVirtualField () {
      this.table.fields.push({
        name: 'virtual1',
        alias: 'virtual1',
        type: 'int',
        comment: 'Virtual field 1',
        isVirtual: true,
        visible: true
      })
      this.handleChange()
    },
    // 删除虚拟字段
    deleteVirtualField (index) {
      this.table.fields.splice(index, 1)
      this.handleChange()
    },
    // 获取聚合语句
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
    // 修改设置
    handleChange () {
      this.$emit('field:change')
    },
    // 获取聚合函数宽度
    __getAggregateFunctionWidth (functionName) {
      const widths = {
        COUNT: 63,
        SUM: 42,
        AVG: 40,
        MAX: 42,
        MIN: 38
      }
      return widths[functionName]
    },
    // 获取sql语句
    __getSql () {
      const sqlLines = []
      sqlLines.push('SELECT')
      // 字段列表
      for (const field of this.visibleFields) {
        if (!field.visible) {
          continue
        }
        const agg = this.getAggregate(field)
        if (agg != null) {
          sqlLines.push('(SELECT')
          sqlLines.push(`${agg.function}(${agg.targetTable.alias}.${agg.targetField.name})`)
          sqlLines.push(`FROM ${agg.targetTable.name} AS ${agg.targetTable.alias}) AS ${agg.field.name},`)
        } else {
          sqlLines.push(`${field.table.alias}.${field.name} AS ${field.alias},`)
        }
      }
      // 最后一个字段去掉逗号
      sqlLines[sqlLines.length - 1] = sqlLines[sqlLines.length - 1].substring(0, sqlLines[sqlLines.length - 1].length - 1)
      // from 表
      if (!this.table.isVirtual) {
        sqlLines.push(`FROM ${this.table.name} AS ${this.table.alias}`)
      }
      // join关系
      for (const join of this.tableJoins) {
        sqlLines.push(`${join.joinType} ${join.targetTable.name} ${join.targetTable.alias}`)
        for (let i = 0; i < join.ons.length; i++) {
          const on = join.ons[i]
          let relationText = i === 0 ? 'ON ': `${on.relation} `
          sqlLines.push(`${relationText}${join.targetTable.alias}.${on.targetField.name} = ${join.table.alias}.${on.field.name}`)
        }
      }
      return sqlLines.join('\n')
    }
  }
}
</script>

<style scoped lang="scss">
.table-setting {
  position: absolute;
  background: #fff;
  padding: 0 30px 10px 30px;
  box-sizing: border-box;
  top: 62px;
  bottom: 0;
  right: 0;
  width: 800px;
  overflow: hidden;
  flex-shrink: 0;
  overflow-y: auto;
  transform: translateX(2000px);
  transition: all ease .3s;
  letter-spacing: 1px;
  box-shadow: -1px 0 10px -2px rgba(0,0,0,.5);
  display: flex;
  flex-direction: column;
  &.visible {
    transform: translateX(0);
  }
  .toolbar {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
    flex-shrink: 0;
    border-bottom: 1px solid var(--border-default-color);
    padding: 10px 0;
  }
  .wrap {
    flex-grow: 1;
    overflow-y: auto;
  }
}
</style>
