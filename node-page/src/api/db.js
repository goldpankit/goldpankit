import request from "../utils/request";

// 测试连接
export function testConnect (data) {
  return request.post('/db/mysql/connect/test', data)
}

