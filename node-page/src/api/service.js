import request from "../utils/request";

// 创建
export function create (data) {
  return request.post('/service/create', data)
}

// 初始化
export function initialize (data) {
  return request.post('/service/initialize', data)
}
