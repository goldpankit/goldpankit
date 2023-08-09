import { MessageBox } from 'element-ui'

export default {
  ...MessageBox,
  /**
   * 删除二次确认
   *
   * @param message 消息内容
   * @returns {Promise<MessageBoxData>}
   */
  deleteConfirm (message) {
    return MessageBox.confirm(message, '删除提醒', {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
  },
  /**
   * 禁用二次确认
   *
   * @param message 消息内容
   * @returns {Promise<MessageBoxData>}
   */
  disableConfirm (message) {
    return MessageBox.confirm(message, '禁用提醒', {
      confirmButtonText: '确认禁用',
      cancelButtonText: '取消',
      type: 'warning'
    })
  },
  /**
   * 导出二次确认
   *
   * @param message 消息内容
   * @returns {Promise<MessageBoxData>}
   */
  exportConfirm (message) {
    return MessageBox.confirm(message, '导出提醒', {
      confirmButtonText: '确认导出',
      cancelButtonText: '取消',
      type: 'warning'
    })
  },
  /**
   * 重要提醒
   *
   * @param message 消息内容
   * @param title 提醒标题
   * @param confirmButtonText 按钮内容
   * @returns {Promise<MessageBoxData>}
   */
  attentionConfirm (message, title = '重要提醒', confirmButtonText = '知道了') {
    return MessageBox.confirm(message, title, {
      confirmButtonText,
      showCancelButton: false,
      showClose: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      type: 'warning'
    })
  }
}
