import request from "../utils/request";

// 创建通用插件
export function createCommon (data) {
  return request.post('/usr/plugin/common/create', data, {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}

