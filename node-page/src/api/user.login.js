import request from "../utils/request";

// 密码登录
export function loginByPassword (data) {
  return request.post('/usr/login/password', data)
}
