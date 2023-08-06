import request from "../utils/request";

// 密码登录
export function loginByPassword (data) {
  return request.post('/usr/login/password', data, {
    baseURL: '/remote-api'
  })
}

// 获取登录信息
export function getLoginInfo (data) {
  return request.get('/usr/login/info', {
    baseURL: '/remote-api'
  })
}

// 退出登录
export function logout () {
  return request.get('/usr/logout')
}
