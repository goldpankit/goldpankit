import request from "../utils/request";

// 构建服务
export function build (data) {
  return request.post('/service/build', data)
}
// 安装服务
export function install (data) {
  return request.post('/service/install', data)
}
// 卸载服务
export function uninstall (data) {
  return request.post('/service/uninstall', data)
}
// 编译服务
export function compile (data) {
  return request.post('/service/compile', data)
}
// 清空编译代码
export function cleanCompile (data) {
  return request.post('/service/compile/clean', data)
}
// 合并代码
export function merge (data) {
  return request.post('/service/files/merge', data)
}
