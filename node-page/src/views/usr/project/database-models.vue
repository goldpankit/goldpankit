<template>
  <div class="page">
    <div class="wrap">
      <h2>{{database}}</h2>
      <div class="content-wrap">
        <div class="model-wrap">
          <ul>
            <li>system_dict</li>
            <li>system_dict_data</li>
            <li>system_interface_config</li>
            <li>system_job</li>
            <li>system_job_log</li>
          </ul>
        </div>
        <div class="model-edit-wrap">
          <div class="main-table">
            <el-form>
              <el-form-item label="Main Table">
                <div class="main-table-info">
                  <el-select>
                    <el-option value="system_user" label="system_user"/>
                  </el-select>
                  <em>AS</em>
                  <el-input/>
                </div>
              </el-form-item>
            </el-form>
          </div>
          <InnerRouterViewWindow ref="window">
            <InnerRouterView name="fields" title="Fields">
              <el-table :data="currentModel.fields">
                <el-table-column type="expand">
                  <template #default="{ row }">
                    <!-- 表格配置 -->
                    <div v-if="row.type === 'Table'" class="settings">
                      <!-- 字段配置 -->
                      <h4>Select Fields</h4>
                      <el-checkbox-group>
                        <el-checkbox label="id">ID/int(11)/主键</el-checkbox>
                        <el-checkbox label="id">ID/int(11)/主键</el-checkbox>
                        <el-checkbox label="id">ID/int(11)/主键</el-checkbox>
                        <el-checkbox label="id">ID/int(11)/主键</el-checkbox>
                        <el-checkbox label="id">ID/int(11)/主键</el-checkbox>
                        <el-checkbox label="id">ID/int(11)/主键</el-checkbox>
                        <el-checkbox label="id">ID/int(11)/主键</el-checkbox>
                      </el-checkbox-group>
                      <!-- Join配置 -->
                      <h4>Join Config</h4>
                      <el-table class="join-table" :data="row.relations">
                        <el-table-column width="120px" label="Join Type" prop="joinType"/>
                        <el-table-column label="Relation Table" prop="relationTableName"/>
                        <el-table-column width="50px" label="On">
                          <template #default>ON</template>
                        </el-table-column>
                        <el-table-column min-width="200px" label="SQL" prop="relationSql"/>
                      </el-table>
                    </div>
                    <!-- 非表格配置 -->
                    <div v-else class="settings">
                      <el-input type="textarea" :rows="5"/>
                      <p class="alias-wrap"><em>AS</em>{{row.name}}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="*Name" min-width="150px" prop="name"></el-table-column>
                <el-table-column label="*Type" prop="type"></el-table-column>
                <el-table-column label="*Tables" min-width="255px" prop="relationTarget">
                  <template #default="{ row }">
                    <p>{{row.relationTarget}}</p>
                    <p class="text-info-1 text-mini">used 3 fields</p>
                  </template>
                </el-table-column>
                <el-table-column label="*Remark" min-width="120px" prop="remark"></el-table-column>
              </el-table>
            </InnerRouterView>
            <InnerRouterView name="joinConfig" title="Join Config">
            </InnerRouterView>
          </InnerRouterViewWindow>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InnerRouterViewWindow from "../../../components/common/InnerRouterView/InnerRouterViewWindow.vue";
import InnerRouterView from "../../../components/common/InnerRouterView/InnerRouterView.vue";

export default {
  name: "models",
  components: {InnerRouterView, InnerRouterViewWindow},
  data () {
    return {
      database: '',
      currentModel: {
        fields: [
          {
            name: 'createUserInfo',
            type: 'Table',
            relationTarget: 'system_user',
            remark: '创建人信息',
            relations: [
              { joinType: 'INNER JOIN', relationTableName: 'CREATE_USER', relationSql: 'createUserInfo.ID = role.CREATE_USER' }
            ]
          },
          {
            name: 'dictRows',
            type: 'Table',
            relationTarget: 'system_dict,system_dict_data',
            remark: '字典配置数据'
          },
          ,
          {
            name: 'regisCount',
            type: 'int(11)',
            relationMethods: '',
            relationTarget: '',
            remark: '注册数'
          }
        ]
      }
    }
  },
  created () {
    this.database = this.$route.params.database
  }
}
</script>

<style scoped lang="scss">
  .page {
    height: 100%;
    box-sizing: border-box;
    padding-bottom: var(--gap-page-bottom);
  }
  .wrap {
    width: var(--page-width);
    margin: 0 auto;
    height: 100%;
    border-radius: var(--radius-page);
    padding: var(--gap-page-padding) 0 0 0;
    background: var(--color-light);
    box-shadow: var(--page-shadow);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  // 标题
  h2 {
    flex-shrink: 0;
    padding: 0 var(--gap-page-padding) 10px var(--gap-page-padding);
    border-bottom: 1px solid var(--border-default-color);
  }
  em {
    color: var(--primary-color-match-2);
    font-weight: bold;
    margin: 0 10px;
    font-style: normal;
  }
  .content-wrap {
    flex-grow: 1;
    display: flex;
    .model-wrap {
      flex-shrink: 0;
      width: 220px;
      border-right: 1px solid var(--border-default-color);
      ul {
        li {
          padding: 10px var(--gap-page-padding);
          border-bottom: 1px solid var(--border-default-color);
          word-break: break-all;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          &:last-of-type {
            border-bottom: 0;
          }
        }
      }
    }
    .model-edit-wrap {
      flex-grow: 1;
      // 主表
      .main-table {
        padding: 15px 20px;
        border-bottom: 1px solid var(--border-default-color);
        .main-table-info {
          display: flex;
        }
      }
      // 表格
      :deep(.el-table) {
        // 扩展区域
        .el-table__expanded-cell {
          padding: 5px;
        }
      }
      // 字段设置
      :deep(.settings) {
        padding: 10px 20px 10px 20px;
        box-shadow: var(--page-shadow);
        background: var(--primary-color);
        border-radius: 10px;
        color: var(--color-light);
        h4 {
          margin-top: 20px;
          margin-bottom: 10px;
          &:first-of-type {
            margin-top: 10px;
          }
        }
        // 关联模型的字段选择
        .el-checkbox-group {
          display: flex;
          flex-wrap: wrap;
        }
        // Join配置
        .join-table {
          .el-table__header-wrapper {
            display: none;
          }
        }
        // 别名
        .alias-wrap {
          margin-top: 10px;
        }
      }
      .inner-router-view-window {
        padding-top: 15px;
      }
    }
  }
</style>
