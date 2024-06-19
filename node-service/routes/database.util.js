const request = require('../utils/request.define')
const mysql = require('../core/utils/db/mysql')
const cache = require('../core/utils/cache')

// 格式化语句
request
  .post('/db/mysql/format')
  .data(req => {
    return mysql.format(req.body.sql)
  })

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

// 检查数据库是否存在
request
  .post('/db/mysql/database/exists')
  .data(req => {
    return mysql.checkDatabase(req.body.config, req.body.database)
  })

// 执行sql
request
  .post('/db/mysql/exec')
  .data(req => {
    let database = cache.datasources.get(req.body.database)
    if (database == null) {
      database = req.body.config
    }
    const sql = mysql.format(req.body.sql)
    return mysql.exec({
      host: database.host,
      port: database.port,
      database: database.schema,
      user: database.username,
      password: database.password
    }, sql)
  })
module.exports = request.router
