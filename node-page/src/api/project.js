import request from "../utils/request";

// 创建
export function create (data) {
  return request.post('/project/create', data)
}

// 删除项目
export function deleteProject (projectId) {
  return request.get(`/project/delete/${projectId}`)
}
// 保存项目配置
export function save (data) {
  return request.post('/project/save', data)
}

// 搜索项目
export function fetchAll (data) {
  return request.post('/project/search', data)
}
// 查询项目信息
export function fetchById (projectId) {
  return request.get(`/project/${projectId}`)
}
// 查询项目配置信息
export function fetchConfigById (projectId) {
  return request.get(`/project/${projectId}/config`)
}
