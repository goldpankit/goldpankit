import request from "../utils/request";

// 编译服务
export function compile (data) {
  return request.post('/service/compile', data)
}
