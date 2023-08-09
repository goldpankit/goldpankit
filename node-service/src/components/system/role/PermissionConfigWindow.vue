<template>
  <GlobalWindow
    class="permission-config-dialog"
    :visible.sync="visible"
    :confirm-working="isWorking"
    width="576px"
    title="授权权限"
    @confirm="confirm"
  >
    <p class="tip" v-if="role != null">为角色 <em>{{role.name}}</em> 配置权限</p>
    <el-tree
      ref="tree"
      :data="permissions"
      show-checkbox
      node-key="id"
      default-expand-all
      :default-checked-keys="selectedIds"
      :expand-on-click-node="false"
      :check-on-click-node="true"
      :props="{children: 'children',label: 'name'}">
    </el-tree>
  </GlobalWindow>
</template>

<script>
import GlobalWindow from '@/components/common/GlobalWindow'
import { createRolePermission } from '@/api/system/role'
import { fetchTree } from '@/api/system/permission'
export default {
  name: 'PermissionConfigWindow',
  components: { GlobalWindow },
  data () {
    return {
      visible: false,
      isWorking: false,
      // 角色对象
      role: null,
      // 权限列表
      permissions: [],
      // 已选中的权限ID
      selectedIds: []
    }
  },
  methods: {
    /**
     * 打开窗口
     *
     * @param role 目标角色
     */
    open (role) {
      fetchTree()
        .then(records => {
          this.role = role
          this.permissions = records
          // 如果为固定角色，则固定权限不可更改
          if (this.role.fixed) {
            this.__handleFixedPermissions(this.permissions)
          }
          this.selectedIds = role.permissions.map(r => r.id)
          this.visible = true
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    /**
     * 确认选择权限
     */
    confirm () {
      const selectedPermissions = this.$refs.tree.getCheckedNodes(false, true).filter(item => item.type !== 'module').map(item => item.id)
      this.isWorking = true
      createRolePermission({
        roleId: this.role.id,
        permissionIds: selectedPermissions
      })
        .then(() => {
          this.visible = false
          this.$emit('success')
          setTimeout(() => {
            this.$dialog.attentionConfirm('权限配置成功，用户需重新登录后生效').then(() => {})
          }, 300)
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
        .finally(() => {
          this.isWorking = false
        })
    },
    /**
     * 处理固定权限
     *
     * @param permissions 权限列表
     * @param module 所属模块
     * @private
     */
    __handleFixedPermissions (permissions, module) {
      if (permissions == null) {
        return
      }
      for (const permission of permissions) {
        if (permission.type !== 'module') {
          if (permission.fixed) {
            permission.disabled = true
            if (module != null) {
              module.disabled = true
            }
          }
          continue
        }
        this.__handleFixedPermissions(permission.children, permission)
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/style/variables.scss";
.global-window {
  .tip {
    em {
      font-style: normal;
      color: $primary-color;
      font-weight: bold;
    }
  }
}
</style>
