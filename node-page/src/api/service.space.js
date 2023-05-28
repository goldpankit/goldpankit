import request from "../utils/request";

// 创建
export function create (data) {
  return request.post('/service/space/create', data)
}

// 根据ID查询
export function fetchByName (name) {
  return request.get(`/service/space/${name}`)
}
// 搜索空间列表
export function search (data) {
  return request.post('/service/space/search', data)
}
