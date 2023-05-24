import request from "../utils/request";

// 安装服务
export function install (data) {
  return request.post('/service/install', data)
}
// 编译服务
export function compile (data) {
  return request.post('/service/compile', data)
}
