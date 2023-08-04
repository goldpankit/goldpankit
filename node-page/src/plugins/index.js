import { ElMessageBox } from 'element-plus'
import message from "./message";
import globalMethods from "./global.methods";
export default {
  install (app, options) {
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
      }
    }
    for (const method in globalMethods) {
      app.config.globalProperties[method] = globalMethods[method]
    }
  }
}
