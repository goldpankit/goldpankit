import request from "../utils/request";

// 发布版本
export function publish (data) {
  return request.post('/service/version/publish', data)
}

// 获取最新版本信息
export function fetchLatestVersion (data) {
  return request.post('/service/version/latest', data, {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}

// 获取版本信息
export function fetchVersion (data) {
  return request.post('/service/version', data, {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}
// 获取主版本文件
export function fetchVersionFiles (data) {
  return request.post('/service/version/files', data, {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}
