import request from "../utils/request";

// 创建
export function create (data) {
  return request.post('/service/space/create', data)
}

// 创建
export function fetchById (id) {
  return request.get(`/service/space/${id}`)
}
