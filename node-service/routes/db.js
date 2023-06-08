const request = require('../utils/request.define')
const mysql = require('../core/utils/db/mysql')

// 测试连接
request
  .post('/db/mysql/connect/test')
  .data(req => {
    return mysql.testConnect(req.body)
  })

// 获取表集合
request
  .post('/db/mysql/tables')
  .data(req => {
    return mysql.getTables(req.body, true)
  })

module.exports = request.router
