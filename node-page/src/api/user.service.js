import request from "../utils/request";

// 创建服务
export function create (data) {
  return request.post('/user/service/create', data)
}
