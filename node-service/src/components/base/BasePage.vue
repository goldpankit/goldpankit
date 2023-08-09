<script>
import { mapState } from 'vuex'
export default {
  name: 'BasePage',
  data () {
    return {
      // 超级管理员角色code
      adminCode: 'admin'
    }
  },
  computed: {
    ...mapState(['userInfo']),
    // 是否为超级管理员
    isAdmin () {
      return this.userInfo.roles.findIndex(code => code === this.adminCode) > -1
    }
  },
  methods: {
    /**
     * 判断是否为DEBUG模式
     */
    isDebug () {
      return process.env.VUE_APP_DEBUG === 'on'
    },
    /**
     * 是否包含指定角色
     *
     * @param roles 目标角色数组
     * @returns {boolean}
     */
    containRoles (roles) {
      if (roles == null) {
        return true
      }
      if (this.userInfo == null) {
        return false
      }
      if (this.userInfo.roles == null || this.userInfo.roles.length === 0) {
        return false
      }
      for (const code of roles) {
        if (this.userInfo.roles.findIndex(r => r === code) > -1) {
          return true
        }
      }
      return false
    },
    /**
     * 是否包含指定权限
     *
     * @param permissions 目标权限数组
     * @returns {boolean}
     */
    containPermissions (permissions) {
      if (permissions == null) {
        return true
      }
      if (this.userInfo == null) {
        return false
      }
      if (this.userInfo.permissions == null || this.userInfo.permissions.length === 0) {
        return false
      }
      for (const code of permissions) {
        if (this.userInfo.permissions.findIndex(p => p === code) > -1) {
          return true
        }
      }
      return false
    }
  }
}
</script>
