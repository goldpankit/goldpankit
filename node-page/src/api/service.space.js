import request from "../utils/request";

// 创建
export function create (data) {
  return request.post('/usr/space/create', data, {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}
// 修改
export function save (data) {
  return request.post('/usr/space/save', data, {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}
// 根据名称查询概要信息
export function fetchProfileByName (name) {
  return request.get(`/space/${name}/profile`, {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}
// 根据名称查询详情
export function fetchByName (name) {
  return request.get(`/space/${name}`, {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}
// 搜索空间列表
export function search (data) {
  return request.post('/space/search', data, {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}
