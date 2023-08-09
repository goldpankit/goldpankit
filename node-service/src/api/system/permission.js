import request from '@/utils/request'

// 查询树列表
export function fetchTree () {
  return request.get('/system/permission/tree')
}

// 新建
export function create (data) {
  return request.post('/system/permission/create', data, {
    trim: true
  })
}

// 修改
export function updateById (data) {
  return request.post('/system/permission/updateById', data, {
    trim: true
  })
}

// 批量修改
export function updateByIdInBatch (data) {
  return request.post('/system/permission/updateByIdInBatch', data, {
    trim: true
  })
}

// 删除
export function deletePermission (data) {
  return request.post('/system/permission/delete', data)
}

// 批量删除
export function deletePermissionInBatch (data) {
  return request.post('/system/permission/delete/batch', data)
}
