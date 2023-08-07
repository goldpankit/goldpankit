import request from "../utils/request";

// 获取客户端版本
export function fetchVersion () {
  return request.get('/client/version')
}
