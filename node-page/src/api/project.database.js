import request from "../utils/request";

// 查询数据库
export function fetchDatabases (projectId) {
  return request.get(`/project/databases/${projectId}`)
}

// 新建
export function create (data) {
  return request.post('/project/database/create', data)
}

// 更新
export function updateById (data) {
  return request.post('/project/database/updateById', data)
}

// 删除
export function deleteById (data) {
  return request.post('/project/database/delete', data)
}
