<template>
  <div class="variable-block">
    <h3>日期相关</h3>
    <el-table :data="variableData.date">
      <el-table-column label="变量名" width="200px" prop="name"></el-table-column>
      <el-table-column v-if="$i18n.locale === 'en'" label="变量备注" width="300px" prop="enRemark"></el-table-column>
      <el-table-column v-if="$i18n.locale === 'zh'" label="变量备注" width="300px" prop="zhRemark"></el-table-column>
      <el-table-column label="示例" prop="demo">
        <template #default="{row}">
          <pre>{{row.demo}}</pre>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="variable-block">
    <h3>表相关</h3>
    <p>定义变量且输入类型为Table，则可以通过变量名访问以下信息！</p>
    <el-table :data="variableData.table">
      <el-table-column label="变量名" width="200px" prop="name"></el-table-column>
      <el-table-column v-if="$i18n.locale === 'en'" label="变量备注" width="300px" prop="enRemark"></el-table-column>
      <el-table-column v-if="$i18n.locale === 'zh'" label="变量备注" width="300px" prop="zhRemark"></el-table-column>
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
        table: [
          { name: 'name', enRemark: '', zhRemark: '原始表名', demo: '${myTable.name} => MY_TABLE' },
          { name: 'camelCaseName', enRemark: '', zhRemark: '表名（驼峰命名法）', demo: '${myTable.camelCaseName} => myTables' },
          { name: 'kebabCaseName', enRemark: '', zhRemark: '表名（中划线命名法）', demo: '${myTable.kebabCaseName} => my-table' },
          { name: 'pascalCaseName', enRemark: '', zhRemark: '表名（帕斯卡命名法）', demo: '${myTable.pascalCaseName} => MyTable' },
          { name: 'underScoreCaseName', enRemark: '', zhRemark: '表名（下划线命名法）', demo: '${myTable.underScoreCaseName} => my_table' },
          { name: 'comment', enRemark: '', zhRemark: '表注释', demo: '${myTable.comment}' },
          { name: 'fields', enRemark: '', zhRemark: '表字段数组', type: 'Array', demo: '<#list myTable.fields as field>\n${field.name}\n</#list>' },
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
  }
}
</style>
