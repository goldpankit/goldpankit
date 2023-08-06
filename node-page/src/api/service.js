import request from "../utils/request";

// 搜索
export function search (data) {
  return request.post('/service/search', data, {
    baseURL: '/remote-api'
  })
}
// 初始化
export function initialize (data) {
  return request.post('/service/initialize', data)
}
// 查询主服务详情
export function fetchMainServiceDetail (data) {
  return request.post('/service/main/detail', data, {
    baseURL: '/remote-api'
  })
}
// 查询子服务列表
export function fetchSubServices (data) {
  return request.post('/service/main/subs', data, {
    baseURL: '/remote-api'
  })
}
// 获取服务信息
export function fetchProfile (data) {
  return request.post('/service/profile', data)
}
// 获取服务文件
export function fetchFiles (space, service) {
  return request.post('/service/files', {space, service})
}
// 获取服务配置
export function fetchConfig (data) {
  return request.post('/service/config', data)
}
// 保存服务配置
export function saveConfig (data) {
  return request.post('/service/config/save', data)
}
// 保存服务文件配置
export function saveFileSetting (data) {
  return request.post('/service/file/setting/save', data)
}
// 保存服务文件配置
export function saveVariables (data) {
  return request.post('/service/variables/save', data)
}

// 翻译服务
export function translate (data) {
  return request.post('/service/translate', data)
}
