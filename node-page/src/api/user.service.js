import request from "../utils/request";

// 创建服务
export function create (data) {
  return request.post('/usr/service/create', data, {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}
