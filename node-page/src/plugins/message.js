import { ElMessage } from 'element-plus'
export default {
  apiFailed (e) {
    ElMessage.error(e.message)
  }
}
