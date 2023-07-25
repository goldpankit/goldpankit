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

// 保存查询模型
export function saveModel (data) {
  return request.post('/database/model/save', data)
}

