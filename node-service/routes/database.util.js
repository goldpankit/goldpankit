const request = require('../utils/request.define')
const mysql = require('../core/utils/db/mysql')
const projectDatabase = require('../core/project.database')

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
    // 查找项目数据库配置
    let database = projectDatabase.getDatabase(req.body.projectId, req.body.databaseId)
    // 没有找到项目数据库，读取config字段
    if (database == null) {
      database = req.body.config
    }
    if (database == null) {
      return Promise.reject('参数错误')
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
