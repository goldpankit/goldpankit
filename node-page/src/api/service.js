import request from "../utils/request";

// 从GIT中克隆服务代码
export function fetchPresetPlugins (data) {
  return request.post('/service/preset/plugins', data, {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}

// 从GIT中克隆服务代码
export function gitClone (data) {
  return request.post('/service/git/clone', data)
}

// 查询本地服务
export function fetchLocalServices (data) {
  return request.get('/service/list')
}
// 搜索
export function search (data) {
  return request.post('/service/search', data, {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}
// 查询服务列表
export function fetchList (data) {
  return request.post('/service/list', data, {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}
// 初始化
export function initialize (data) {
  return request.post('/service/initialize', data)
}
// 查询主服务详情
export function fetchServiceDetail (data) {
  return request.post('/service/detail', data, {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}
// 获取服务信息
export function fetchProfile (data) {
  return request.post('/service/profile', data)
}
// 获取服务文件
export function fetchFiles (data) {
  return request.post('/service/files', data)
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
