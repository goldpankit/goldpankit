<template>
  <div class="table-setting" :class="{ visible }">
    <div class="toolbar">
      <h2>SQL预览</h2>
      <div class="opera">
        <el-button type="primary" size="default" class="button-copy" @click="copy">复制</el-button>
        <el-button type="primary" size="default" @click="execute">执行语句</el-button>
      </div>
    </div>
    <div class="wrap" v-if="table != null">
      <SQL
        :model="model"
        :table="table"
        :repaired-joins="repairedJoins"
        :aggregates="aggregates"
        :visible-fields="visibleFields"
        @field:change="$emit('field:change', $event)"
        @field:created="$emit('field:created', $event)"
        @field:deleted="$emit('field:deleted', $event)"
      />
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
  components: { SQL, QueryResultPreview, SQLLineKeywordSelect, DynamicWidthInput, SQLLine},
  props: {
    visible: {
      default: true
    },
    // 模型
    model: {
      required: true
    },
    // 表
    table: {},
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
        fields.add(field)
      }
      // join表字段
      for (const join of this.repairedJoins) {
        for (const field of join.table.fields) {
          field.table = join.table
          fields.add(field)
        }
        for (const field of join.targetTable.fields) {
          field.table = join.targetTable
          fields.add(field)
        }
      }
      return [...fields]
    },
    /**
     * 修复表joins关系，使得join.targetTable一直为待关联的表，且targetTable在已修复的joins中不可重复（注意这里的重复指的是table.id不重复，使得可以关联多张相同的表）
     * e.g A.a1 => B.b1, B.b2 => C.c1，此时应得到joins为[{ table:A, targetTable:B }, {table: B, targetTable: C}]，可的语句为JOIN B, JOIN C
     * @returns {*}
     */
    repairedJoins () {
      // 已修复的join
      const repairedJoins = []
      /*
      如果joins中没有主表，则视为没有关联关系
      e.g 存在主表M1，子表S1和S2，S1和S2建立了关联关系，但并没有与M1建立关联关系，此时不产生SQL语句。因为SQL语句展示的是当前表的关联关系
      */
      if (!this.joins.find(join => join.table.id === this.table.id || join.targetTable.id === this.table.id)) {
        return []
      }
      for (const join of this.joins) {
        /*
        此处拷贝一份join，避免影响原来的join
        且只需复制join的引用，需要保留join内部对象的引用，避免表和字段发生变化时未能及时修改join中的信息
        */
        const copyJoin = { ...join }
        /*
        监听copyJoin属性的变化，一旦发生变化，赋值给join
        为什么监听？因为此处为computed，对象属性不可被赋值，永远都是计算得来，而这里的对象属性joinType和relation会在SQL预览窗口中进行修改，所以需要进行监听后赋值给对应的join
        这样在重新计算后，才能正确获取joinType和relation
        */
        const copyJoinProxy = new Proxy(copyJoin, {
          set: (target, key, value) => {
            target[key] = value
            if (key === 'joinType' || key === 'relation') {
              join[key] = value
            }
            return true
          }
        })
        // 主表关联了子表，不做处理
        if (join.table.id === this.table.id) {
          repairedJoins.push(copyJoinProxy)
          continue
        }
        // 子表关联了主表，则targetTable为主表，则将table作为targetTable（此时table为子表）
        if (join.targetTable.id === this.table.id) {
          const targetTable = copyJoinProxy.table
          copyJoinProxy.table = copyJoinProxy.targetTable
          copyJoinProxy.targetTable = targetTable
          repairedJoins.push(copyJoinProxy)
          continue
        }
        // 子表关联了子表，则判断已修复的joins中，是否存在当前targetTable，如果存在，则将table作为targetTable
        const existJoin = repairedJoins.find(join => join.targetTable.id === copyJoinProxy.targetTable.id)
        if (existJoin) {
          const targetTable = copyJoinProxy.table
          copyJoinProxy.table = copyJoinProxy.targetTable
          copyJoinProxy.targetTable = targetTable
        }
        repairedJoins.push(copyJoinProxy)
      }
      return repairedJoins
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
    // 获取sql语句
    __getSql () {
      if (this.table == null) {
        return {
          fields: [],
          sql: ''
        }
      }
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
          sqlLines = sqlLines.concat(this.__getJoinSql(agg.targetTable, this.repairedJoins))
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
        let tableAlias = ` AS \`${this.table.alias}\``
        if (this.table.name === this.table.alias) {
          tableAlias = ''
        }
        sqlLines.push(`FROM \`${this.table.name}\`${tableAlias}`)
      }
      // join关系
      sqlLines = sqlLines.concat(this.__getJoinSql(this.table, this.repairedJoins))
      return {
        fields,
        sql: sqlLines.join('\n')
      }
    },
    // 获取JOIN语句
    __getJoinSql (table, joins) {
      const joinLines = []
      for (const join of joins) {
        let joinTableAlias = ` \`${join.targetTable.alias}\``
        if (join.targetTable.name === join.targetTable.alias) {
          joinTableAlias = ''
        }
        joinLines.push(`${join.joinType} \`${join.targetTable.name}\`${joinTableAlias}`)
        for (let i = 0; i < join.ons.length; i++) {
          const on = join.ons[i]
          let relationText = i === 0 ? 'ON ': `${on.relation} `
          joinLines.push(`${relationText}\`${on.table.alias}\`.\`${on.field.name}\` = \`${on.targetTable.alias}\`.\`${on.targetField.name}\``)
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
  background-color: #fff;
  padding: 0 30px 10px 30px;
  box-sizing: border-box;
  top: 0;
  bottom: 0;
  z-index: 100;
  right: 0;
  width: 650px;
  overflow: hidden;
  flex-shrink: 0;
  overflow-y: auto;
  transform: translateX(2000px);
  transition: all ease .3s;
  letter-spacing: 1px;
  box-shadow: -1px 0 10px -5px rgba(0,0,0,.5);
  display: flex;
  flex-direction: column;
  &.visible {
    transform: translateX(0);
  }
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    flex-shrink: 0;
    border-bottom: 1px solid var(--border-default-color);
    padding: 10px 0;
    h2 {
      font-size: 16px;
    }
  }
  .wrap {
    flex-grow: 1;
    overflow-y: auto;
  }
}
</style>
