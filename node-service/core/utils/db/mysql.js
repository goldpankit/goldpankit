const mysql = require('mysql');

class MySQL {
  constructor() {
  }
  // 连接测试
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
      // if (test) {
      //   connection.end()
      // }
    })

  }
}

module.exports = new MySQL()
