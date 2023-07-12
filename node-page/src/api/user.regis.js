import request from "../utils/request";

// 根据手机号码注册
export function regisByMobile (data) {
  return request.post('/usr/regis/mobile', data)
}

// 发送根据手机号码注册短信验证码
export function sendRegisByMobileSms (data) {
  return request.post('/usr/regis/mobile/sms', data)
}
