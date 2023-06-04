const mysql = require('mysql');

class MySQL {
  constructor() {
  }

  /**
   * 测试排解
   * config = {
   *  host: '',
   *  port: '',
   *  user: '',
   *  password: '',
   *  database: ''
   * }
   * @param config 连接配置
   * @returns {Promise<void>}
   */
  testConnect (config) {
    return this.connect(config)
      .then(conn => {
        conn.end()
        return Promise.resolve()
      })
      .catch(e => {
        return Promise.reject(e)
      })
  }
  // 连接
  connect (config) {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection(config)
      connection.connect((error) => {
        if (error) {
          reject(error)
          return
        }
        resolve(connection)
      })
    })

  }
  // 执行SQL
  exec (config, sql) {
    return this.connect(config)
      .then(conn => {
        return new Promise((resolve, reject) => {
          conn.query(sql, function (error, results) {
            conn.end()
            if (error) {
              return reject(error.sqlMessage)
            }
            return resolve(results)
          })
        })
      })
      .catch(e => {
        return Promise.reject(e)
      })
  }
}

module.exports = new MySQL()
