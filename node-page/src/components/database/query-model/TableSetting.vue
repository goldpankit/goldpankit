<template>
  <div class="table-setting" :class="{ visible: table != null }">
    <h4>Table Setting</h4>
    <el-form v-if="table != null">
      <el-form-item label="Alias">
        <el-input v-model="table.alias"/>
      </el-form-item>
      <el-form-item v-if="tableJoins.length > 0" label="Join SQL">
        <div v-for="(join,index) in tableJoins" :key="join.joinTable + index" class="join-sql">
          <div class="join-sql-control">
            <div class="control-elements">
              <el-select v-model="join.joinType">
                <el-option value="INNER JOIN">INNER JOIN</el-option>
                <el-option value="LEFT JOIN">LEFT JOIN</el-option>
                <el-option value="RIGHT JOIN">RIGHT JOIN</el-option>
              </el-select>
              <em>{{join.joinTable.name}}</em>
              <em>{{join.joinTable.alias}}</em>
              <em>ON</em>
            </div>
            <div class="opera">
              <el-button class="button-icon" icon="Plus"></el-button>
            </div>
          </div>
          <ul class="on-sql-control">
            <li v-for="on in join.ons">
              <em>{{table.alias}}.</em>
              <el-select size="small" v-model="on.startField">
              </el-select>
              <el-input :value="`= ${join.joinTable.alias}.${on.endField}`"/>
            </li>
          </ul>
        </div>
      </el-form-item>
      <el-form-item label="Query Fields">
        <el-table :data="table.fields">
          <el-table-column label="Name" width="150px" prop="name" fixed></el-table-column>
          <el-table-column label="SQL" prop="name">
            <template #default="{ row, $index }">
              <el-input type="textarea" :rows="1" :value="`${row.name} AS ${row.name}${$index === table.fields.length - 1 ? '' : ','}`"/>
            </template>
          </el-table-column>
          <!--            <el-table-column label="Comment" width="150px" prop="comment"></el-table-column>-->
          <!--            <el-table-column label="Type" width="100px" prop="type"></el-table-column>-->
          <!--            <el-table-column label="length" width="80px" prop="length"></el-table-column>-->
          <!--            <el-table-column label="Decimal" width="90px" prop="decimal"></el-table-column>-->
          <!--            <el-table-column label="Default Value" width="125px" prop="defaultValue"></el-table-column>-->
          <!--            <el-table-column label="Required" width="100px" prop="required"></el-table-column>-->
          <!--            <el-table-column label="Primary Key" width="125px" prop="isPrimaryKey"></el-table-column>-->
          <!--            <el-table-column label="Auto Increment" width="145px" prop="isAutoIncrement"></el-table-column>-->
        </el-table>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "TableSetting",
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
  &.visible {
    transform: translateX(0);
  }
  .join-sql {
    width: 100%;
    .join-sql-control {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .on-sql-control {
      width: 100%;
      & > li {
        padding-left: 30px;
        display: flex;
        align-items: center;
        .el-select {
          width: 100px;
          margin-right: 5px;
        }
        .el-input {
          width: 300px;
          font-size: var(--font-size-mini);
        }
        em {
          font-size: var(--font-size-mini);
        }
      }
    }
    .el-select,.el-input {
      width: 130px;
      margin-right: 5px;
      border: 0;
      :deep(.el-input__wrapper) {
        box-shadow: none;
      }
    }
    em {
      color: var(--primary-color-match-2);
      margin-left: 10px;
      font-weight: bold;
      font-style: normal;

      &.none-margin {
        margin-left: 0;
        margin-right: 5px;
      }
    }
  }
}
</style>
