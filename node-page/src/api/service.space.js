import request from "../utils/request";

// 创建
export function create (data) {
  return request.post('/space/create', data)
}

// 根据ID查询
export function fetchByName (name) {
  return request.get(`/space/${name}`)
}
// 搜索空间列表
export function search (data) {
  return request.post('/space/search', data)
}
