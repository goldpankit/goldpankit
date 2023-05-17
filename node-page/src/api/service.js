import request from "../utils/request";

// 创建
export function create (data) {
  return request.post('/service/create', data)
}

// 初始化
export function initialize (data) {
  return request.post('/service/initialize', data)
}

// 获取服务信息
export function getProfile (id) {
  return request.get(`/service/profile/${id}`)
}
