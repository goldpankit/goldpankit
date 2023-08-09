<template>
  <GlobalWindow
    :title="title"
    :visible.sync="visible"
    :confirm-working="isWorking"
    @confirm="confirm"
  >
    <el-form :model="form" ref="form" :rules="rules">
      <el-form-item label="权限编码" prop="code" required>
        <el-input v-model="form.code" placeholder="请输入权限编码" v-trim maxlength="50"/>
      </el-form-item>
      <el-form-item label="权限名称" prop="name" required>
        <el-input v-model="form.name" placeholder="请输入权限名称" v-trim maxlength="50"/>
      </el-form-item>
      <el-form-item label="权限模块" prop="module">
        <el-input v-model="form.module" placeholder="请输入权限模块" v-trim maxlength="500"/>
        <FormItemTip>多个模块可以通过"/"分割，例如"日志管理/操作日志"</FormItemTip>
      </el-form-item>
      <el-form-item label="权限备注" prop="remark">
        <el-input v-model="form.remark" placeholder="请输入权限备注" type="textarea" :rows="3" v-trim maxlength="500"/>
      </el-form-item>
    </el-form>
  </GlobalWindow>
</template>

<script>
import BaseOpera from '@/components/base/BaseOpera'
import GlobalWindow from '@/components/common/GlobalWindow'
import FormItemTip from '@/components/common/FormItemTip'
export default {
  name: 'OperaPermissionWindow',
  extends: BaseOpera,
  components: { FormItemTip, GlobalWindow },
  data () {
    return {
      // 原权限码
      originPermissionCode: '',
      // 表单数据
      form: {
        id: null,
        code: '',
        name: '',
        module: '',
        remark: ''
      },
      // 验证规则
      rules: {
        code: [
          { required: true, message: '请输入权限编码' }
        ],
        name: [
          { required: true, message: '请输入权限名称' }
        ],
        module: [
          { validator: this.__checkModule, trigger: 'blur' }
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
      if (target == null || target.type === 'module') {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
          this.form[this.configData['field.id']] = null
          if (target.type === 'module') {
            this.form.module = target.modulePath
          }
        })
        return
      }
      // 编辑
      this.$nextTick(() => {
        this.originPermissionCode = target.code
        for (const key in this.form) {
          this.form[key] = target[key]
        }
      })
    },
    /**
     * 确认
     */
    confirm () {
      if (this.form.id == null || this.form.id === '') {
        this.__confirmCreate()
        return
      }
      if (this.originPermissionCode === this.form.code) {
        this.__confirmEdit()
        return
      }
      // 修改了权限编码
      this.$dialog.confirm('检测到您修改了权限编码，权限编码修改后前后端均可能需要调整代码，确认修改吗？', '提示', {
        confirmButtonText: '确认修改',
        type: 'warning'
      })
        .then(() => {
          this.__confirmEdit()
        })
    },
    /**
     * 验证模块
     *
     * @param rule 规则
     * @param value 值
     * @param callback 回调
     * @returns {*}
     * @private
     */
    __checkModule (rule, value, callback) {
      if (value == null || value === '') {
        return callback()
      }
      // 不允许包含空格
      if (value.indexOf(' ') !== -1) {
        return callback(new Error('不允许包含空格'))
      }
      // 不允许使用"/"开头或结尾
      if (value.startsWith('/') || value.endsWith('/')) {
        return callback(new Error('请勿使用"/"开头或结尾'))
      }
      return callback()
    }
  },
  created () {
    this.config({
      api: '/system/permission'
    })
  }
}
</script>
