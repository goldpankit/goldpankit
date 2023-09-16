import request from "../utils/request";

// 查询本地插件
export function fetchLocalPlugins () {
  return request.get('/plugin/list')
}
// 初始化
export function initialize (data) {
  return request.post('/plugin/initialize', data)
}
// 获取插件信息
export function fetchProfile (data) {
  return request.post('/plugin/profile', data)
}
// 获取插件文件
export function fetchFiles (data) {
  return request.post('/plugin/files', data)
}
// 获取插件配置
export function fetchConfig (data) {
  return request.post('/plugin/config', data)
}
// 保存插件配置
export function saveConfig (data) {
  return request.post('/plugin/config/save', data)
}
// 保存插件文件配置
export function saveFileSetting (data) {
  return request.post('/plugin/file/setting/save', data)
}
// 保存插件变量
export function saveVariables (data) {
  return request.post('/plugin/variables/save', data)
}
// 查询子服务列表
export function fetchList (data) {
  return request.post('/service/plugins', data, {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}
