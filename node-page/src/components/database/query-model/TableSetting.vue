<template>
  <div class="table-setting" :class="{ visible: table != null }">
    <div class="toolbar">
      <el-button type="primary" class="button-copy" data-clipboard-text="Hello World" @click="copy">{{$t('common.copy')}}</el-button>
      <el-button type="primary" @click="execute">{{$t('common.execute')}}</el-button>
    </div>
    <div class="wrap" v-if="table != null">
      <SQL :aggregates="aggregates" :joins="joins" :table="table" @field:change="handleChange"/>
    </div>
    <QueryResultPreview ref="queryResultPreview"/>
  </div>
</template>

<script>
import {mapState} from "vuex";
import SQLLine from "./SQLLine.vue";
import DynamicWidthInput from "../../common/DynamicWidthInput.vue";
import SQLLineKeywordSelect from "./SQLLineKeywordSelect.vue";
import QueryResultPreview from "./QueryResultPreview.vue";
import SQL from "./SQL.vue";
import {formatSql} from "@/api/database.util";

export default {
  name: "TableSetting",
  components: {SQL, QueryResultPreview, SQLLineKeywordSelect, DynamicWidthInput, SQLLine},
  props: {
    // 表
    table: {
      required: true
    },
    // 表join信息
    joins: {
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
    // 拷贝语句
    copy () {
      formatSql({
        sql: this.__getSql().sql
      })
        .then(sql => {
          return navigator.clipboard.writeText(sql)
        })
        .then(() => {
          this.$tip.success(this.$t('common.copySuccessfully'))
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 执行语句
    execute () {
      const sql = this.__getSql()
      this.$refs.queryResultPreview.open(sql.fields, sql.sql, [])
    },
    // 修改设置
    handleChange () {
      this.$emit('field:change')
    },
    // 获取sql语句
    __getSql () {
      let sqlLines = []
      const fields = []
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
          sqlLines.push(`FROM \`${agg.targetTable.name}\` AS \`${agg.targetTable.alias}\``)
          sqlLines = sqlLines.concat(this.__getJoinSql(agg.targetTable, this.joins))
          sqlLines.push(`) AS \`${agg.field.alias}\`,`)
          fields.push(`\`${agg.field.alias}\``)
        } else {
          sqlLines.push(`\`${field.table.alias}\`.\`${field.name}\` AS \`${field.alias}\`,`)
          fields.push(`\`${field.alias}\``)
        }
      }
      // 最后一个字段去掉逗号
      sqlLines[sqlLines.length - 1] = sqlLines[sqlLines.length - 1].substring(0, sqlLines[sqlLines.length - 1].length - 1)
      // from 表
      if (!this.table.isVirtual) {
        sqlLines.push(`FROM \`${this.table.name}\` AS \`${this.table.alias}\``)
      }
      // join关系
      sqlLines = sqlLines.concat(this.__getJoinSql(this.table, this.joins))
      return {
        fields,
        sql: sqlLines.join('\n')
      }
    },
    // 获取JOIN语句
    __getJoinSql (table, joins) {
      const joinLines = []
      const currentTableJoins = joins.filter(join => join.table.id === table.id)
      for (const join of currentTableJoins) {
        joinLines.push(`${join.joinType} \`${join.targetTable.name}\` \`${join.targetTable.alias}\``)
        for (let i = 0; i < join.ons.length; i++) {
          const on = join.ons[i]
          let relationText = i === 0 ? 'ON ': `${on.relation} `
          joinLines.push(`${relationText}\`${join.targetTable.alias}\`.\`${on.targetField.name}\` = \`${join.table.alias}\`.\`${on.field.name}\``)
        }
      }
      return joinLines
    },
    // 获取字段聚合信息
    getAggregate (field) {
      const aggregate = this.aggregates.find(agg => agg.field.name === field.name)
      if (aggregate == null) {
        return null
      }
      return aggregate
    },
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
  z-index: 100;
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
