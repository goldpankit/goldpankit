import request from "../utils/request";

// 分页查询用户租赁的服务和自己的服务
export function fetchPage (data) {
  return request.post('/usr/service/page', data, {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}

// 创建服务
export function create (data) {
  return request.post('/usr/service/create', data, {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}

// 删除服务
export function deleteService (data) {
  return request.post('/usr/service/delete', data)
}
