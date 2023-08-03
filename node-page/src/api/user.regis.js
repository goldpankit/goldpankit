import request from "../utils/request";

// 根据手机号码注册
export function regisByMobile (data) {
  return request.post('/usr/regis/mobile', data)
}

// 根据邮箱注册
export function regisByEmail (data) {
  return request.post('/usr/regis/email', data)
}

// 发送根据手机号码注册动态码
export function sendRegisByMobileOtpCode (data) {
  return request.post('/usr/regis/mobile/opt-code', data)
}
// 发送根据邮箱注册动态码
export function sendRegisByEmailOtpCode (data) {
  return request.post('/usr/regis/email/otp-code', data)
}
