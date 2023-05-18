import request from "../utils/request";

// 创建
export function create (data) {
  return request.post('/service/space/create', data)
}
// 根据ID查询
export function fetchById (id) {
  return request.get(`/service/space/${id}`)
}
// 搜索空间列表
export function search () {
  return request.get('/service/space/search')
}
