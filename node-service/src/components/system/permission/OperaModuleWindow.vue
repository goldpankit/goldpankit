<template>
  <GlobalWindow
    :title="title"
    :visible.sync="visible"
    :confirm-working="isWorking"
    @confirm="confirm"
  >
    <el-form :model="form" ref="form" :rules="rules">
      <el-form-item label="权限模块" prop="module">
        <el-input v-model="form.module" placeholder="请输入权限模块" v-trim maxlength="500"/>
        <FormItemTip>多个模块可以通过"/"分割，例如"日志管理/操作日志"</FormItemTip>
      </el-form-item>
    </el-form>
  </GlobalWindow>
</template>

<script>
import BaseOpera from '@/components/base/BaseOpera'
import GlobalWindow from '@/components/common/GlobalWindow'
import FormItemTip from '@/components/common/FormItemTip'
import { updateByIdInBatch } from '@/api/system/permission'

export default {
  name: 'OperaModuleWindow',
  extends: BaseOpera,
  components: { FormItemTip, GlobalWindow },
  data () {
    return {
      // 行数据
      row: null,
      // 表单数据
      form: {
        module: ''
      },
      // 验证规则
      rules: {
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
     * @param title 标题
     * @param target 行对象（仅编辑需该参数）
     */
    open (title, target) {
      this.title = title
      this.row = target
      this.visible = true
      // 编辑
      this.$nextTick(() => {
        this.form.module = target.name
      })
    },
    /**
     * 确认
     */
    confirm () {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        const pool = []
        this.__fillPool(pool, this.row.children, this.form.module)
        this.isWorking = true
        updateByIdInBatch(pool)
          .then(() => {
            this.visible = false
            this.$emit('success')
          })
          .catch(e => {
            this.$tip.apiFailed(e)
          })
          .finally(() => {
            this.isWorking = false
          })
      })
    },
    /**
     * 填充权限池，将所有权限的模块前缀调整为新权限模块后丢入pool中
     *
     * @param pool 权限池
     * @param list 权限列表
     * @param newModule 新权限模块
     */
    __fillPool (pool, list, newModule) {
      if (list == null) {
        return
      }
      for (const child of list) {
        if (child.type !== 'module') {
          const modulePaths = child.module.split('/')
          modulePaths[this.row.level] = newModule
          child.module = modulePaths.join('/')
          pool.push(child)
          continue
        }
        this.__fillPool(pool, child.children, newModule)
      }
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
