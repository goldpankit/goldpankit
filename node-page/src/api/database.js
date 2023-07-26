import request from "../utils/request";

// 搜索
export function search (data) {
  return request.post('/database/search', data)
}

// 新建
export function create (data) {
  return request.post('/database/create', data)
}

// 更新
export function updateById (data) {
  return request.post('/database/updateById', data)
}

// 删除
export function deleteById (id) {
  return request.get(`/database/delete/${id}`)
}

// 创建模型
export function createModel (data) {
  return request.post('/database/model/create', data)
}

// 修改模型
export function updateModel (data) {
  return request.post('/database/model/update', data)
}

// 删除模型
export function deleteModel (data) {
  return request.post('/database/model/delete', data)
}
