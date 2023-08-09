<template>
  <el-drawer
    class="global-window"
    title="title"
    :visible="visible"
    :with-header="true"
    :size="width"
    :close-on-press-escape="false"
    :wrapper-closable="false"
    :append-to-body="true"
    @close="close"
  >
    <div slot="title" class="window__header">
      <span class="header__btn-back" @click="close"><i class="el-icon-arrow-left"></i></span>{{title}}
    </div>
    <div class="window__body">
      <slot></slot>
    </div>
    <div v-if="withFooter" class="window__footer">
      <slot name="footer">
        <el-button @click="confirm" :loading="confirmWorking" type="primary">{{confirmText}}</el-button>
        <el-button @click="close">{{cancelText}}</el-button>
      </slot>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: 'GlobalWindow',
  props: {
    width: {
      type: String,
      default: '36%'
    },
    // 是否包含底部操作
    withFooter: {
      type: Boolean,
      default: true
    },
    // 确认按钮loading状态
    confirmWorking: {
      type: Boolean,
      default: false
    },
    // 确认按钮文案
    confirmText: {
      default: '确定'
    },
    // 取消按钮文案
    cancelText: {
      default: '取消'
    },
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 是否展示
    visible: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    /**
     * 确认
     */
    confirm () {
      this.$emit('confirm')
    },
    /**
     * 关闭
     */
    close () {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/style/variables.scss";
// 输入框高度
$input-height: 32px;
.global-window {
  // 头部标题
  /deep/ .el-drawer__header {
    padding: 0 10px 0 0;
    line-height: 40px;
    border-bottom: 1px solid #eee;
    // 返回按钮
    .header__btn-back {
      display: inline-block;
      width: 30px;
      background: $primary-color;
      color: #fff;
      text-align: center;
      margin-right: 12px;
      border-right: 1px solid #eee;
    }
    .el-drawer__close-btn:focus {
      outline: none;
    }
  }
  // 主体
  /deep/ .el-drawer__body {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 40px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    // 内容
    .window__body {
      height: 100%;
      overflow-y: auto;
      padding: 12px 16px;
      // 标签
      .el-form-item__label {
        float: none;
      }
      // 元素宽度为100%
      .el-form-item__content{
        & > * {
          width: 100%;
        }
      }
      // 开关表单项
      .form-item-switch {
        .el-form-item__content > * {
          width: auto !important;
        }
        .switch-text {
          color: #999;
          margin-left: 6px;
          font-size: 13px;
          vertical-align: middle;
        }
      }
    }
    // 尾部
    .window__footer {
      user-select: none;
      border-top: 1px solid #eee;
      height: 60px;
      line-height: 60px;
      text-align: center;
    }
  }
}
</style>
