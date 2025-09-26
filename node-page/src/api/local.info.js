import request from "../utils/request";

// 获取本地信息
export function fetchLocalInfo () {
  return request.get('/local/info')
}
