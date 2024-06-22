import request from "../utils/request";

// 创建模型
export function create (data) {
  return request.post('/project/database/model/create', data)
}

// 修改模型
export function updateById (data) {
  return request.post('/project/database/model/update', data)
}

// 删除模型
export function deleteById (data) {
  return request.post('/project/database/model/delete', data)
}
