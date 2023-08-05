import request from "../utils/request";

// 获取余额
export function getBalance () {
  return request.get('/usr/balance')
}
