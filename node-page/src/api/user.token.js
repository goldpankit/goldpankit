import request from "../utils/request";

// 获取令牌
export function getToken () {
  return request.get('/usr/token')
}

// 写入令牌
export function save (token) {
  return request.post('/usr/token/save', { token })
}
