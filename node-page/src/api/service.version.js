import request from "../utils/request";

// 发布版本
export function publish (data) {
  return request.post('/service/version/publish', data)
}

// 获取版本信息
export function fetchVersion (data) {
  return request.post('/service/version', data)
}
