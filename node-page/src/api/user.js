import request from "../utils/request";

// 获取余额
export function getBalance () {
  return request.get('/usr/balance', {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}

// 修改用户资料
export function saveProfile (data) {
  return request.post('/usr/profile/save', data, {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}
