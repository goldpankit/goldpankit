import { ElMessageBox } from 'element-plus'
export default {
  install (app, options) {
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
  }
}
