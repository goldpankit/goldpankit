import { ElMessage } from 'element-plus'
export default {
  ...ElMessage,
  apiFailed (e) {
    console.log('e', e)
    if (typeof e === 'string') {
      return ElMessage.error(e)
    }
    return ElMessage.error(e.message)
  }
}
