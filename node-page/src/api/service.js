import request from "../utils/request";

// 创建
export function create (data) {
  return request.post('/service/create', data)
}
// 搜索
export function search (data) {
  return request.post('/service/search', data)
}
// 初始化
export function initialize (data) {
  return request.post('/service/initialize', data)
}
// 推送服务
export function push (id) {
  return request.get(`/service/${id}/push`)
}
// 获取服务信息
export function getProfile (data) {
  return request.post('/service/profile', data)
}
// 获取服务文件
export function fetchFiles (id) {
  return request.get(`/service/${id}/files`)
}
// 获取服务文件
export function fetchConfig (id) {
  return request.get(`/service/${id}/config`)
}
// 保存服务文件配置
export function saveFileSetting (data) {
  return request.post('/service/file/setting/save', data)
}
// 保存服务文件配置
export function saveVariables (data) {
  return request.post('/service/variables/save', data)
}
