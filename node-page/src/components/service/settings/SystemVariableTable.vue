<template>
  <div class="variable-block">
    <h3>日期相关</h3>
    <el-table :data="variableData.date">
      <el-table-column label="变量名" width="200px" prop="name"></el-table-column>
      <el-table-column label="变量备注" width="300px" prop="zhRemark"></el-table-column>
      <el-table-column label="示例" prop="demo">
        <template #default="{row}">
          <pre>{{row.demo}}</pre>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="variable-block">
    <h3>MySQL表相关</h3>
    <p>定义变量且输入类型为Table，则可以通过变量名访问以下信息！</p>
    <el-table :data="variableData.mysqlTable">
      <el-table-column label="变量名" width="235px" prop="name"></el-table-column>
      <el-table-column label="变量备注" width="300px" prop="zhRemark"></el-table-column>
      <el-table-column label="示例" prop="demo">
        <template #default="{row}">
          <pre>{{row.demo}}</pre>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="variable-block">
    <h3>MySQL查询模型相关</h3>
    <p>定义变量且输入类型为Query Model，则可以通过变量名访问以下信息！</p>
    <el-table :data="variableData.mysqlQueryModel">
      <el-table-column label="变量名" width="235px" prop="name"></el-table-column>
      <el-table-column label="变量备注" width="300px" prop="zhRemark"></el-table-column>
      <el-table-column label="示例" prop="demo">
        <template #default="{row}">
          <pre>{{row.demo}}</pre>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="variable-block">
    <h3>Select输入类型的深度设置</h3>
    <p>定义变量且输入类型为Select，则可以通过变量名添加"Settings"后缀来获取深度设置对象！</p>
    <el-table :data="variableData.select">
      <el-table-column label="变量名" width="235px" prop="name"></el-table-column>
      <el-table-column label="变量备注" width="300px" prop="zhRemark"></el-table-column>
      <el-table-column label="示例" prop="demo">
        <template #default="{row}">
          <pre>{{row.demo}}</pre>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {
  name: "SystemVariableTable",
  data () {
    return {
      variableData: {
        date: [
          { name: '_yyyy', enRemark: '', zhRemark: '年（固定4位）', demo: '${_yyyy} => 1993' },
          { name: '_MM', enRemark: '', zhRemark: '月（固定2位）', demo: '${_MM} => 08' },
          { name: '_dd', enRemark: '', zhRemark: '日前（固定2位）', demo: '${_dd} => 13' },
          { name: '_hh', enRemark: '', zhRemark: '时（固定2位）', demo: '${_hh} => 00' },
          { name: '_mm', enRemark: '', zhRemark: '分（固定2位）', demo: '${_mm} => 00' },
          { name: '_ss', enRemark: '', zhRemark: '秒（固定2位）', demo: '${_ss} => 00' },
          { name: '_sss', enRemark: '', zhRemark: '毫秒（固定3位）', demo: '${_sss} => 000' },
        ],
        mysqlTable: [
          { name: 'name', enRemark: '', zhRemark: '原始表名', demo: '${myTable.name} => MY_TABLE' },
          { name: 'camelCaseName', enRemark: '', zhRemark: '表名（驼峰命名法）', demo: '${myTable.camelCaseName} => myTable' },
          { name: 'kebabCaseName', enRemark: '', zhRemark: '表名（中划线命名法）', demo: '${myTable.kebabCaseName} => my-table' },
          { name: 'pascalCaseName', enRemark: '', zhRemark: '表名（帕斯卡命名法）', demo: '${myTable.pascalCaseName} => MyTable' },
          { name: 'underScoreCaseName', enRemark: '', zhRemark: '表名（下划线命名法）', demo: '${myTable.underScoreCaseName} => my_table' },
          { name: 'alias', enRemark: '', zhRemark: '表别名，默认与表名一致', demo: '${myTable.alias} => MY_ALIAS' },
          { name: 'camelCaseAlias', enRemark: '', zhRemark: '表别名（驼峰命名法）', demo: '${myTable.camelCaseAlias} => myAlias' },
          { name: 'kebabCaseAlias', enRemark: '', zhRemark: '表别名（中划线命名法）', demo: '${myTable.kebabCaseAlias} => my-alias' },
          { name: 'pascalCaseAlias', enRemark: '', zhRemark: '表别名（帕斯卡命名法）', demo: '${myTable.pascalCaseAlias} => MyAlias' },
          { name: 'underScoreCaseAlias', enRemark: '', zhRemark: '表名（下划线命名法）', demo: '${myTable.underScoreCaseAlias} => my_alias' },
          { name: 'comment', enRemark: '', zhRemark: '表注释', demo: '${myTable.comment}' },
          { name: 'pk', enRemark: '', zhRemark: '表字段数组', type: 'Array', demo: '<#if myTable.pk??>\n${myTable.pk.name}\n</#list>' },
          { name: 'fields', enRemark: '', zhRemark: '表字段数组', type: 'Array', demo: '<#list myTable.fields as field>\n${field.name}\n</#list>' },
          { name: 'fields.name', enRemark: '', zhRemark: '字段原始名称', type: 'String', demo: '<#list myTable.fields as field>\n${field.name}\n</#list>' },
          { name: 'fields.camelCaseName', enRemark: '', zhRemark: '字段名称（驼峰命名法）', type: 'String', demo: '<#list myTable.fields as field>\n${field.camelCaseName}\n</#list>' },
          { name: 'fields.kebabCaseName', enRemark: '', zhRemark: '字段名称（中划线命名法）', type: 'String', demo: '<#list myTable.fields as field>\n${field.kebabCaseName}\n</#list>' },
          { name: 'fields.pascalCaseName', enRemark: '', zhRemark: '字段名称（帕斯卡命名法）', type: 'String', demo: '<#list myTable.fields as field>\n${field.pascalCaseName}\n</#list>' },
          { name: 'fields.underScoreCaseName', enRemark: '', zhRemark: '字段名称（下划线命名法）', type: 'String', demo: '<#list myTable.fields as field>\n${field.underScoreCaseName}\n</#list>' },
          { name: 'fields.alias', enRemark: '', zhRemark: '字段别名', type: 'String', demo: '<#list myTable.fields as field>\n${field.alias}\n</#list>' },
          { name: 'fields.camelCaseAlias', enRemark: '', zhRemark: '字段别名（驼峰命名法）', type: 'String', demo: '<#list myTable.fields as field>\n${field.camelCaseAlias}\n</#list>' },
          { name: 'fields.kebabCaseAlias', enRemark: '', zhRemark: '字段别名（中划线命名法）', type: 'String', demo: '<#list myTable.fields as field>\n${field.kebabCaseAlias}\n</#list>' },
          { name: 'fields.pascalCaseAlias', enRemark: '', zhRemark: '字段别名（帕斯卡命名法）', type: 'String', demo: '<#list myTable.fields as field>\n${field.pascalCaseAlias}\n</#list>' },
          { name: 'fields.underScoreCaseAlias', enRemark: '', zhRemark: '字段别名（下划线命名法）', type: 'String', demo: '<#list myTable.fields as field>\n${field.underScoreCaseAlias}\n</#list>' },
          { name: 'fields.type', enRemark: '', zhRemark: '数据库字段类型', type: 'String', demo: '<#list myTable.fields as field>\n${field.type}\n</#list>' },
          { name: 'fields.length', enRemark: '', zhRemark: '数据库字段类型长度', type: 'Integer', demo: '<#list myTable.fields as field>\n${field.length}\n</#list>' },
          { name: 'fields.decimal', enRemark: '', zhRemark: '数据库字段类型精度', type: 'Integer', demo: '<#list myTable.fields as field>\n${field.decimal}\n</#list>' },
          { name: 'fields.defaultValue', enRemark: '', zhRemark: '字段默认值', type: 'Any', demo: '<#list myTable.fields as field>\n${field.defaultValue}\n</#list>' },
          { name: 'fields.required', enRemark: '', zhRemark: '是否必填', type: 'Boolean', demo: '<#list myTable.fields as field>\n${field.required}\n</#list>' },
          { name: 'fields.isPrimaryKey', enRemark: '', zhRemark: '是否为主键', type: 'Boolean', demo: '<#list myTable.fields as field>\n${field.isPrimaryKey}\n</#list>' },
          { name: 'fields.isAutoIncrement', enRemark: '', zhRemark: '是否为自增长', type: 'Boolean', demo: '<#list myTable.fields as field>\n${field.isAutoIncrement}\n</#list>' },
          { name: 'fields.comment', enRemark: '', zhRemark: '字段注释', type: 'Boolean', demo: '<#list myTable.fields as field>\n${field.comment}\n</#list>' },
        ],
        mysqlQueryModel: [
          { name: 'name', enRemark: '', zhRemark: '模型原始名称', demo: '${myModel.name}' },
          { name: 'camelCaseName', enRemark: '', zhRemark: '模型名称（驼峰命名法）', demo: '${myModel.camelCaseName}' },
          { name: 'kebabCaseName', enRemark: '', zhRemark: '模型名称（中划线命名）', demo: '${myModel.kebabCaseName}' },
          { name: 'pascalCaseName', enRemark: '', zhRemark: '模型名称（帕斯卡命名）', demo: '${myModel.pascalCaseName}' },
          { name: 'underScoreCaseName', enRemark: '', zhRemark: '模型名称（下划线命名）', demo: '${myModel.underScoreCaseName}' },
          { name: 'comment', enRemark: '', zhRemark: '模型注释', demo: '${myModel.comment}' },
          { name: 'mainTable', enRemark: '', zhRemark: '主表，包含了MySQL表的所有信息', demo: '${myModel.mainTable.name} => 主表名称\n${myModel.mainTable.camelCaseName} => 主表名称（驼峰命名法）' },
          { name: 'mainTable.pk', enRemark: '', zhRemark: '主表主键字段信息', demo: '<#if myModel.mainTable.pk??>\n  ${myModel.mainTable.pk.name}\n</#if>' },
          { name: 'mainTable.alias', enRemark: '', zhRemark: '主表别名', demo: '${myModel.mainTable.alias}' },
          // { name: 'mainTable.fields.aggregate', enRemark: '', zhRemark: '字段聚合信息', demo: '' },
          // { name: 'mainTable.fields.aggregate.table', enRemark: '', zhRemark: '目标表（聚合的表）', demo: '' },
          // { name: 'mainTable.fields.aggregate.field', enRemark: '', zhRemark: '目标字段（聚合的字段）', demo: '' },
          // { name: 'mainTable.fields.aggregate.function', enRemark: '', zhRemark: '使用的聚合函数', demo: '<#list myModel.mainTable.fields as field>\n  <#if field.aggregate??>\n    ${field.aggregate.function}(\`${field.aggregate.table.alias}\`.\`${field.aggregate.field.name}\`)\n  </#if>\n</#list>\n => COUNT(\`user\`.\`id\`)' },
          // { name: 'mainTable.isVirtual', enRemark: '', zhRemark: '是否为虚拟表', demo: '${myModel.mainTable.isVirtual}' },
          { name: 'subTables', enRemark: '', zhRemark: '子表，包含了MySQL表的所有信息', type: 'Array', demo: '<#list myModel.subTables as subTable>\n${subTable.name}\n</#list>' },
          { name: 'subTables.pk', enRemark: '', zhRemark: '子表主键字段信息', type: 'Array', demo: '<#list myModel.subTables as subTable>\n<#if subTable.pk??>\n  ${subTable.pk.name}\n</#if>\n</#list>' },
          { name: 'subTables.alias', enRemark: '', zhRemark: '子表别名', type: 'Array', demo: '<#list myModel.subTables as subTable>\n${subTable.alias}\n</#list>' },
          // { name: 'subTables.isVirtual', enRemark: '', zhRemark: '子表是否为虚拟表', type: 'Array', demo: '<#list myModel.subTables as subTable>\n${subTable.isVirtual}\n</#list>' },
          { name: 'statement', enRemark: '', zhRemark: '各个部分的SQL语句', demo: '' },
          { name: 'statement.joins', enRemark: '', zhRemark: '查询模型的join语句', demo: '<#list myModel.statement.joins as joinLine>\n${joinLine}\n</#list>\n => INNER JOIN USER `user` ON `user`.`id` = `test.`field`\nINNER JOIN USER `user` ON `test`.`field` = `test2.`field2`' },
          { name: 'statement.from', enRemark: '', zhRemark: '查询模型的from语句', demo: '${myModel.statement.from}\n => FROM USER `user`' },
          { name: 'statement.字段变量组', enRemark: '', zhRemark: '查询模型的字段变量组选中的字段语句', demo: '例如为模型添加了"查询条件"字段变量组"queryFields"，则可以使用\n<#list myModel.statement.queryFields as statement>\n  ${statement}\n</#list>\n来读取字段语句' },
          { name: 'joins', enRemark: '', zhRemark: '关联信息', demo: '<#list myModel.joins as join>\n${join.joinType}\n</#list>' },
          { name: 'joins.joinType', enRemark: '', zhRemark: 'JOIN类型', demo: '<#list myModel.joins as join>\n${join.joinType}\n</#list>' },
          { name: 'joins.ons', enRemark: '', zhRemark: 'JOIN ON条件', demo: '<#list myModel.joins as join>\n  <#list join.ons as on>\n    ${on.field.alias} => 字段别名\n  </#list>\n</#list>' },
          { name: 'joins.ons.table', enRemark: '', zhRemark: '关联表', demo: '<#list myModel.joins as join>\n  <#list join.ons as on>\n    ${on.table.name}\n  </#list>\n</#list>' },
          { name: 'joins.ons.targetTable', enRemark: '', zhRemark: '被关联表', demo: '<#list myModel.joins as join>\n  <#list join.ons as on>\n    ${on.targetTable.name}\n  </#list>\n</#list>' },
          { name: 'joins.ons.field', enRemark: '', zhRemark: '关联字段', demo: '<#list myModel.joins as join>\n  <#list join.ons as on>\n    ${on.field.name}\n  </#list>\n</#list>' },
          { name: 'joins.ons.targetField', enRemark: '', zhRemark: '被关联字段', demo: '<#list myModel.joins as join>\n  <#list join.ons as on>\n    ${on.targetField.name}\n  </#list>\n</#list>' },
          { name: 'joins.ons.relation', enRemark: '', zhRemark: 'ON关系，AND或者OR', demo: '<#list myModel.joins as join>\n  <#list join.ons as on>\n    ${on.relation}\n  </#list>\n</#list>' },
        ],
        select: [
          { name: 'mySelect', enRemark: '', zhRemark: '选项值', type: 'Any', demo: '${mySelect}' },
          { name: 'mySelectSetting', enRemark: '', zhRemark: 'select深度设置内容', type: 'Object', demo: '${mySelectSetting.myField}' },
        ]
      }
    }
  }
}
</script>

<style scoped lang="scss">
.variable-block {
  padding: 30px;
  & > p {
    margin-top: 10px;
  }
  & > .el-table {
    margin-top: 20px;
    pre {
      word-break: break-all;
      white-space: pre-wrap;
    }
  }
}
</style>
