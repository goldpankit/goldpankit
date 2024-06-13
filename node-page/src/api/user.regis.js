import request from "../utils/request";

// 根据手机号码注册
export function regisByMobileOTP (data) {
  return request.post('/usr/regis/mobile', data, {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}

// 发送根据手机号码注册动态码
export function sendRegisMobileOTP (data) {
  return request.post('/usr/regis/mobile/otp-code', data, {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}
