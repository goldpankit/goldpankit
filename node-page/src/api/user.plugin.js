import request from "../utils/request";

// 创建插件
export function create (data) {
  return request.post('/usr/plugin/create', data, {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}

