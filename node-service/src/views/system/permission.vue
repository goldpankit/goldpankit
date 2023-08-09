<template>
  <TableLayout :permissions="['system:permission:query']">
    <!-- 表格和分页 -->
    <template v-slot:table-wrap>
      <el-tabs v-model="currentTab" v-loading="isWorking.search">
        <el-tab-pane :name="'module'+module.id" :label="module.name" v-for="module in tableData.list" :key="module.id">
          <ul class="toolbar" v-permissions="['system:permission:create', 'system:permission:delete']">
            <li><el-button type="primary" @click="$refs.operaPermissionWindow.open('新建系统权限', module)" icon="el-icon-plus" v-permissions="['system:permission:create']">新建</el-button></li>
            <li><el-button @click="deleteByIdInBatch" icon="el-icon-delete" v-permissions="['system:permission:delete']">删除</el-button></li>
          </ul>
          <el-table
            :data="module.children"
            :ref="'module' + module.id"
            row-key="id"
            stripe
            default-expand-all
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" fixed="left" width="55"></el-table-column>
            <el-table-column prop="name" label="权限名称" fixed="left" min-width="200px"></el-table-column>
            <el-table-column prop="code" label="权限编码" min-width="200px"></el-table-column>
            <el-table-column prop="remark" label="权限备注" min-width="120px"></el-table-column>
            <el-table-column prop="createUser" label="创建人" min-width="100px">
              <template slot-scope="{row}">{{row.createUserInfo == null ? '' : row.createUserInfo.username}}</template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="140px"></el-table-column>
            <el-table-column prop="updateUser" label="更新人" min-width="100px">
              <template slot-scope="{row}">{{row.updateUserInfo == null ? '' : row.updateUserInfo.username}}</template>
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间" min-width="140px"></el-table-column>
            <el-table-column
              v-if="containPermissions(['system:permission:update', 'system:permission:delete'])"
              label="操作"
              min-width="150"
              fixed="right"
            >
              <template slot-scope="{row}">
                <!-- 模块编辑&删除 -->
                <template v-if="row.type === 'module'">
                  <el-button type="text" @click="$refs.operaModuleWindow.open('编辑模块', row)" icon="el-icon-edit" v-permissions="['system:permission:update']">编辑</el-button>
                  <el-button type="text" @click="$refs.operaPermissionWindow.open('新建系统权限', row)" icon="el-icon-edit" v-permissions="['system:permission:update']">添加权限</el-button>
                  <el-button v-if="!row.fixed" type="text" @click="deletePermission(row)" icon="el-icon-delete" v-permissions="['system:permission:delete']">删除</el-button>
                </template>
                <!-- 权限编辑&删除 -->
                <template v-else>
                  <el-button v-if="!row.fixed" type="text" @click="$refs.operaPermissionWindow.open('编辑系统权限', row)" icon="el-icon-edit" v-permissions="['system:permission:update']">编辑</el-button>
                  <el-button v-if="!row.fixed" type="text" @click="deletePermission(row)" icon="el-icon-delete" v-permissions="['system:permission:delete']">删除</el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </template>
    <!-- 新建/修改 -->
    <OperaPermissionWindow ref="operaPermissionWindow" @success="search"/>
    <!-- 编辑权限模块 -->
    <OperaModuleWindow ref="operaModuleWindow" @success="handlePageChange"/>
  </TableLayout>
</template>

<script>
import TableLayout from '@/layouts/TableLayout'
import BaseTable from '@/components/base/BaseTable'
import OperaPermissionWindow from '@/components/system/permission/OperaPermissionWindow'
import OperaModuleWindow from '@/components/system/permission/OperaModuleWindow'

export default {
  name: 'SystemPermission',
  extends: BaseTable,
  components: { OperaModuleWindow, OperaPermissionWindow, TableLayout },
  data () {
    return {
      // 当前选中的模块
      currentTab: null
    }
  },
  methods: {
    /**
     * 覆盖页码变更处理
     */
    handlePageChange () {
      this.isWorking.search = true
      this.api.fetchTree()
        .then(data => {
          this.tableData.list = data
          this.currentTab = 'module' + this.tableData.list[0].id
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
        .finally(() => {
          this.isWorking.search = false
        })
    },
    /**
     * 覆盖删除处理
     */
    deletePermission (row, childConfirm = true) {
      this.__checkApi()
      let message = `确认删除${this.module}【${row[this.configData['field.main']]}】吗?`
      if (childConfirm && row.children != null && row.children.length > 0) {
        message = `确认删除${this.module}【${row[this.configData['field.main']]}】及其子${this.module}吗?`
      }
      this.$dialog.deleteConfirm(message)
        .then(() => {
          this.isWorking.delete = true
          this.api.deletePermission({
            id: row.type === 'module' ? null : row.id, // 模块不传ID
            modulePrefix: row.type === 'module' ? row.modulePath : null // 权限不传模块
          })
            .then(() => {
              this.$tip.apiSuccess('删除成功')
              this.__afterDelete()
            })
            .catch(e => {
              this.$tip.apiFailed(e)
            })
            .finally(() => {
              this.isWorking.delete = false
            })
        })
        .catch(() => {})
    },
    /**
     * 覆盖批量删除处理
     */
    deleteByIdInBatch (childConfirm = true) {
      this.__checkApi()
      if (this.tableData.selectedRows.length === 0) {
        this.$tip.warning('请至少选择一条数据')
        return
      }
      let message = `确认删除已选中的 ${this.tableData.selectedRows.length} 条${this.module}记录吗?`
      if (childConfirm) {
        const containChildrenRows = []
        for (const row of this.tableData.selectedRows) {
          if (row.children != null && row.children.length > 0) {
            containChildrenRows.push(row[this.configData['field.main']])
          }
        }
        if (containChildrenRows.length > 0) {
          message = `本次将删除${this.module}【${containChildrenRows.join('、')}】及其子${this.module}记录，确认删除吗？`
        }
      }
      this.$dialog.deleteConfirm(message)
        .then(() => {
          this.isWorking.delete = true
          this.api.deletePermissionInBatch(this.tableData.selectedRows.map(row => {
            return {
              id: row.type === 'module' ? null : row.id, // 模块不传ID
              modulePrefix: row.type === 'module' ? row.modulePath : null // 权限不传模块
            }
          }))
            .then(() => {
              this.$tip.apiSuccess('删除成功')
              this.__afterDelete(this.tableData.selectedRows.length)
            })
            .catch(e => {
              this.$tip.apiFailed(e)
            })
            .finally(() => {
              this.isWorking.delete = false
            })
        })
        .catch(() => {})
    }
  },
  created () {
    this.config({
      module: '权限',
      api: '/system/permission'
    })
    this.search()
  }
}
</script>

<style scoped lang="scss">
/deep/ .table-content {
  margin-top: 0;
  .table-wrap {
    padding-bottom: 16px;
  }
}
/deep/ .el-tabs__nav-prev, /deep/ .el-tabs__nav-next {
  line-height: 40px;
}
</style>
