const request = require('../utils/request.define')
const mysql = require('../core/utils/db/mysql')

// 获取运行时根目录
request
  .post('/db/mysql/connect/test')
  .data(req => {
    return mysql.testConnect(req.body)
  })

module.exports = request.router
