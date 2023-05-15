import request from "../utils/request";

// 创建
export function create (data) {
  return request.post('/service/create', data)
}
