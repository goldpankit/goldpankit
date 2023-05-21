import request from "../utils/request";

// 创建
export function create (data) {
  return request.post('/usr/project/create', data)
}
// 搜索项目
export function search (data) {
  return request.post('/usr/project/search', data)
}
// 查询项目信息
export function fetchById (projectId) {
  return request.get(`/usr/project/${projectId}`)
}
