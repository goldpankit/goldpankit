import { ElMessageBox } from 'element-plus'
import message from "./message";
import globalMethods from "./global.methods";
import constants from './constants'
export default {
  install (app, options) {
    app.config.globalProperties.$const = constants
    app.config.globalProperties.$tip = message
    app.config.globalProperties.$model = {
      // 删除确认
      deleteConfirm (message) {
        return ElMessageBox({
          title: 'Confirm Delete?',
          message: message,
          showCancelButton: true,
          cancelButtonText: 'Cancel',
          confirmButtonText: 'Delete',
          confirmButtonClass: 'danger-button'
        })
      },
      // 确认安装
      installConfirm (price) {
        return ElMessageBox({
          title: 'Confirm Install?',
          message: `Installing this service will deduct ${price} gold beans from your account. Are you sure you want to proceed with the installation?`,
          showCancelButton: true,
          cancelButtonText: 'Cancel',
          confirmButtonText: 'PAY AND INSTALL'
        })
      },
      // 确认卸载
      uninstallConfirm () {
        return ElMessageBox({
          title: 'Confirm Uninstall?',
          message: 'Are you sure you want to uninstall this service?',
          showCancelButton: true,
          cancelButtonText: 'Cancel',
          confirmButtonText: 'INSTALL'
        })
      }
    }
    for (const method in globalMethods) {
      app.config.globalProperties[method] = globalMethods[method]
    }
  }
}
