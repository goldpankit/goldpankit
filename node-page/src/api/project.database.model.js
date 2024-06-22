import request from "../utils/request";

// 查询松油
export function fetchAll (data) {
  return request.post('/project/database/models', data)
}

// 创建
export function create (data) {
  return request.post('/project/database/model/create', data)
}

// 修改
export function updateById (data) {
  return request.post('/project/database/model/update', data)
}

// 删除
export function deleteById (data) {
  return request.post('/project/database/model/delete', data)
}
