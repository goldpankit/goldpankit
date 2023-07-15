import request from "../utils/request";

// 测试连接
export function testConnect (data) {
  return request.post('/db/mysql/connect/test', data)
}

// 获取表集合
export function fetchTables (data) {
  return request.post('/db/mysql/tables', data)
}

