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
// 获取服务文件
export function fetchFiles (id) {
  return request.get(`/service/${id}/files`)
}
// 保存服务文件配置
export function saveFileSetting (data) {
  return request.post('/service/file/setting/save', data)
}