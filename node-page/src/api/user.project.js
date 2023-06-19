import request from "../utils/request";

// 创建
export function create (data) {
  return request.post('/usr/project/create', data)
}
// 保存项目配置
export function saveConfig (data) {
  return request.post('/usr/project/save', data)
}

// 保存查询模型
export function saveModel (data) {
  return request.post('/usr/project/model/save', data)
}

// 搜索项目
export function search (data) {
  return request.post('/usr/project/search', data)
}
// 查询项目信息
export function fetchById (projectId) {
  return request.get(`/usr/project/${projectId}`)
}
// 查询项目配置信息
export function fetchConfigById (projectId) {
  return request.get(`/usr/project/${projectId}/config`)
}
