import { ElMessageBox } from 'element-plus'

export default {
  ...ElMessageBox,
  /**
   * 成功提示
   *
   * @param message 消息
   * @param title 标题
   * @param delay 延迟时间（毫秒）
   * @param extConfig 扩展配置
   */
  success (message, title = '操作成功', delay = 300, extConfig = {}) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        ElMessageBox.alert(message, title, {
          customClass: 'success-message-box',
          type: 'success',
          ...extConfig
        })
          .then(() => {
            resolve()
          })
          .catch(e => {
            reject(e)
          })
      }, delay)
    })
  },
  /**
   * 删除二次确认
   *
   * @param message 消息内容
   * @param extConfig 扩展配置
   * @returns {Promise}
   */
  deleteConfirm (message, extConfig = {}) {
    return ElMessageBox.confirm(message, '删除提醒', {
      customClass: 'delete-message-box',
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      confirmButtonClass: 'el-button--danger',
      type: 'warning',
      ...extConfig
    })
  },
  /**
   * 禁用二次确认
   *
   * @param message 消息内容
   * @param extConfig 扩展配置
   * @returns {Promise}
   */
  disableConfirm (message, extConfig = {}) {
    return ElMessageBox.confirm(message, '禁用提醒', {
      confirmButtonText: '确认禁用',
      cancelButtonText: '取消',
      confirmButtonClass: 'el-button--danger',
      type: 'warning',
      ...extConfig
    })
  },
  /**
   * 启用二次确认
   *
   * @param message 消息内容
   * @param extConfig 扩展配置
   * @returns {Promise}
   */
  enableConfirm (message, extConfig = {}) {
    return ElMessageBox.confirm(message, '启用提醒', {
      confirmButtonText: '确认启用',
      cancelButtonText: '取消',
      type: 'warning',
      ...extConfig
    })
  },
  /**
   * 导出二次确认
   *
   * @param message 消息内容
   * @param extConfig 扩展配置
   * @returns {Promise}
   */
  exportConfirm (message, extConfig = {}) {
    return ElMessageBox.confirm(message, '导出提醒', {
      confirmButtonText: '确认导出',
      cancelButtonText: '取消',
      type: 'warning',
      ...extConfig
    })
  },
  /**
   * 重要提醒
   *
   * @param message 消息内容
   * @param title 提醒标题
   * @param extConfig 扩展配置
   * @returns {Promise}
   */
  attentionConfirm (message, title = '重要提醒', extConfig = {}) {
    return ElMessageBox.confirm(message, title, {
      showCancelButton: false,
      showClose: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      type: 'warning',
      ...extConfig
    })
  }
}
