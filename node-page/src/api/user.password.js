import request from "../utils/request";

// 修改用户密码
export function updatePwd (data) {
  return request.post('/usr/password/update', data, {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}

// 根据短信验证码修改密码
export function updateByMobileOTP (data) {
  return request.post('/usr/password/updateByMobileOTP', data, {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}

// 发送修改密码短信验证码
export function sendUpdatePasswordMobileOTP (data) {
  return request.post('/usr/password/sendUpdatePasswordMobileOTP', data, {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}
