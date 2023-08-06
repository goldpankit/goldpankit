import request from "../utils/request";

// 创建
export function create (data) {
  return request.post('/usr/space/create', data, {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}

// 根据ID查询
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
