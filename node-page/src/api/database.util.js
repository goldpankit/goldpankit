import request from "../utils/request";

// 测试连接
export function testConnect (data) {
  return request.post('/db/mysql/connect/test', data)
}

// 获取表集合
export function fetchTables (data) {
  return request.post('/db/mysql/tables', data)
}

// 检查数据库是否存在
export function checkDatabaseExists (data) {
  return request.post('/db/mysql/database/exists', data)
}

// 格式化语句
export function formatSql (data) {
  return request.post('/db/mysql/format', data)
}

// 执行SQL
export function execSql (data) {
  return request.post('/db/mysql/exec', data)
}

