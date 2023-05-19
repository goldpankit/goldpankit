import request from "../utils/request";

// 创建
export function create (data) {
  return request.post('/usr/project/create', data)
}
// 搜索项目
export function search (data) {
  return request.post('/usr/project/search', data)
}
