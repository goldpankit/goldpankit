import { ElMessage } from 'element-plus'
export default {
  ...ElMessage,
  apiFailed (e) {
    console.error && console.error('接口错误', e)
    // 检查是否存在全局错误
    const globalErrorDom = document.querySelector('.el-message--error')
    if (globalErrorDom != null) {
      return
    }
    if (typeof e === 'string') {
      return ElMessage.error(e)
    }
    return ElMessage.error(e.message)
  }
}
