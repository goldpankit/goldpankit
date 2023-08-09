<template>
  <!-- 新建/修改 -->
  <GlobalWindow
    :title="title"
    :visible.sync="visible"
    :confirm-working="isWorking"
    @confirm="confirm"
  >
    <el-form :model="form" ref="form" :rules="rules">
      <el-form-item label="用户名" prop="username" required>
        <el-input v-model="form.username" placeholder="请输入用户名" v-trim maxlength="50"/>
      </el-form-item>
      <el-form-item label="姓名" prop="realname" required>
        <el-input v-model="form.realname" placeholder="请输入姓名" v-trim maxlength="50"/>
      </el-form-item>
      <el-form-item label="性别" prop="sex" required>
        <el-radio-group v-model="form.sex">
          <el-radio label="1">男</el-radio>
          <el-radio label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="头像" prop="avatar" required>
        <el-radio-group v-model="form.avatar" class="form-item-avatar">
          <el-radio label="/avatar/man.png" border><img src="/avatar/man.png" alt=""></el-radio>
          <el-radio label="/avatar/woman.png" border><img src="/avatar/woman.png" alt=""></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.id == null" label="初始密码" prop="password" required>
        <el-input v-model="form.password" type="password" placeholder="请输入初始密码" maxlength="30" show-password/>
      </el-form-item>
      <el-form-item label="工号" prop="empNo">
        <el-input v-model="form.empNo" placeholder="请输入工号" v-trim maxlength="50"/>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号码" v-trim maxlength="11"/>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱" v-trim maxlength="200"/>
      </el-form-item>
      <el-form-item label="生日" prop="birthday">
        <el-date-picker v-model="form.birthday" value-format="yyyy-MM-dd" placeholder="请选择用户生日"/>
      </el-form-item>
    </el-form>
  </GlobalWindow>
</template>

<script>
import BaseOpera from '@/components/base/BaseOpera'
import GlobalWindow from '@/components/common/GlobalWindow'
import { checkMobile, checkEmail } from '@/utils/form'

export default {
  name: 'OperaUserWindow',
  extends: BaseOpera,
  components: { GlobalWindow },
  data () {
    return {
      // 表单数据
      form: {
        id: null,
        username: '', // 用户名
        realname: '', // 姓名
        empNo: '', // 工号
        avatar: '/avatar/man.png', // 头像
        password: '', // 密码
        mobile: '', // 手机号码
        email: '', // 邮箱
        sex: '1', // 性别
        birthday: '' // 生日
      },
      // 验证规则
      rules: {
        username: [
          { required: true, message: '请输入用户名' }
        ],
        realname: [
          { required: true, message: '请输入姓名' }
        ],
        password: [
          { required: true, message: '请输入密码' }
        ],
        avatar: [
          { required: true, message: '请选择用户头像' }
        ],
        sex: [
          { required: true, message: '请选择用户性别' }
        ],
        mobile: [
          { validator: checkMobile }
        ],
        email: [
          { validator: checkEmail }
        ]
      }
    }
  },
  methods: {
    /**
     * 打开窗口
     *
     * @param title 窗口标题
     * @param target 行对象（仅编辑需该参数）
     */
    open (title, target) {
      this.title = title
      this.visible = true
      // 新建
      if (target == null) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
          this.form.id = null
          this.form.departmentId = null
          this.form.positionIds = []
        })
        return
      }
      // 编辑
      this.$nextTick(() => {
        for (const key in this.form) {
          this.form[key] = target[key]
        }
        this.form.departmentId = target.department == null ? null : target.department.id
        this.form.positionIds = target.positions == null ? [] : target.positions.map(p => p.id)
      })
    }
  },
  created () {
    this.config({
      api: '/system/user'
    })
  }
}
</script>

<style lang="scss" scoped>
.global-window {
  /deep/ .el-date-editor {
    width: 100%;
  }
  // 表单头像处理
  /deep/ .form-item-avatar {
    .el-radio.is-bordered {
      height: auto;
      padding: 6px;
      margin: 0 10px 0 0;
      .el-radio__input {
        display: none;
      }
      .el-radio__label {
        padding: 0;
        width: 48px;
        display: block;
        img {
          width: 100%;
        }
      }
    }
  }
}
</style>
