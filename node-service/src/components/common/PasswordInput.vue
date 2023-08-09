<template>
  <div class="password-input">
    <el-input
      :class="{ 'use-text': withoutAutoFill, 'with-show-password': withShowPassword, 'show-password': showPassword}"
      :type="type"
      :value="value"
      :maxlength="maxlength"
      @input="$emit('input', $event)"
    />
    <i v-if="withShowPassword" class="el-input__icon el-icon-view el-input__clear" @click="switchShowPassword"></i>
  </div>
</template>

<script>
export default {
  name: 'PasswordInput',
  props: {
    value: {},
    // 是否允许显示密码操作
    withShowPassword: {
      type: Boolean,
      default: true
    },
    // 不自动填充，仅chrome内核和safari支持（禁用浏览器在密码框聚焦时弹出密码列表，同时也会禁用浏览器密码的自动保存）
    withoutAutoFill: {
      type: Boolean,
      default: true
    },
    // 最大长度
    maxlength: {
      type: Number
    }
  },
  data () {
    return {
      type: 'text',
      showPassword: false
    }
  },
  methods: {
    /**
     * 切换隐藏/显示密码
     */
    switchShowPassword () {
      this.showPassword = !this.showPassword
    }
  }
}
</script>

<style scoped lang="scss">
.password-input {
  position: relative;
  .use-text {
    /deep/ .el-input__inner {
      // 文本调整为圆点（仅chrome内核和safari支持）
      -webkit-text-security: disc;
      font-size: 14px;
    }
    // 展示密码控制
    &.with-show-password /deep/ .el-input__inner {
      padding-right: 40px;
    }
    // 展示密码
    &.show-password /deep/ .el-input__inner {
      -webkit-text-security: initial;
    }
  }
  // 查看密码图标
  i {
    position: absolute;
    top: 50%;
    right: 10px;
    height: 20px;
    line-height: 20px;
    margin-top: -11px;
    color: #C0C4CC;
    font-size: 14px;
    &:hover {
      color: #909399;
    }
  }
}
</style>
