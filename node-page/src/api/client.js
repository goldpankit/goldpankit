import request from "../utils/request";

// 获取客户端版本
export function fetchVersion () {
  return request.get('/client/version')
}

// 查询国际化语言
export function fetchLang () {
  return request.get('/client/lang')
}

// 修改国际化语言
export function saveLang (data) {
  return request.post('/client/lang/save', data)
}
