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
          connection.end()
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
  // 获取所有表
  getTables (config, withFields = false) {
    return new Promise((resolve, reject) => {
      this.connect(config)
        .then(conn => {
          return new Promise((tableResolve, tableReject) => {
            conn.query(
              `SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = '${config.database}' ORDER BY TABLE_NAME ASC`,
              (error, tables) => {
                if (error) {
                  conn.end()
                  reject(error.sqlMessage)
                }
                // 如果需要携带字段，则将tables等信息带入下一次then
                if (withFields) {
                  tableResolve({conn, config, tables})
                  return
                }
                // 不需要携带字段，则断开连接，返回tables
                conn.end()
                resolve(tables.map(table => {
                  return {
                    name: table.TABLE_NAME,
                    comment: table.TABLE_COMMENT
                  }
                }))
                tableResolve({})
              }
            )
          })
        })
        .then(({conn, config, tables}) => {
          if (tables == null) {
            return
          }
          // 查询表字段
          const queryFieldPromises = []
          for (const table of tables) {
            queryFieldPromises.push(this.#getFields(conn, config.database, table.TABLE_NAME))
          }
          // 所有表字段查询完毕后组装table信息
          Promise.all(queryFieldPromises)
            .then(tableFields => {
              resolve(tables.map((table,index) => {
                return {
                  name: table.TABLE_NAME,
                  comment: table.TABLE_COMMENT,
                  fields: tableFields[index]
                }
              }))
            })
            .finally(() => {
              conn.end()
            })
        })
        .catch(e => {
          console.log('e', e)
          reject(e)
        })
    })
  }
  // 获取表信息
  getTable (config, table) {
    return new Promise((resolve, reject) => {
      this.connect(config)
        .then(conn => {
          return new Promise((resolve, reject) => {
            conn.query(
              `SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = '${config.database}' AND TABLE_NAME = '${table}'`,
              (error, tables) => {
                if (error) {
                  conn.end()
                  reject(error.sqlMessage)
                }
                if (tables == null || tables.length === 0) {
                  reject(`can not found table ${table}.`)
                }
                resolve({conn, config, tables})
              }
            )
          })
        })
        .then(({conn, config, tables}) => {
          // 查询表字段
          this.#getFields(conn, config.database, tables[0].TABLE_NAME)
            .then(fields => {
              resolve({
                name: tables[0].TABLE_NAME,
                comment: tables[0].TABLE_COMMENT,
                fields
              })
            })
            .finally(() => {
              conn.end()
            })
        })
    })
  }
  // 获取表字段
  #getFields (conn, database, table) {
    return new Promise((resolve, reject) => {
      conn.query(`SELECT * FROM information_schema.columns WHERE table_name='${table}' AND table_schema='${database}' ORDER BY ORDINAL_POSITION ASC`, function (error, results, fields) {
        if (error) {
          reject(error.sqlMessage)
          return
        }
        resolve(results.map(field => {
          let index = field.COLUMN_TYPE.indexOf('(')
          let length = 0
          let decimal = 0
          if (index !== -1) {
            let secondInfo = field.COLUMN_TYPE.substring(index + 1, field.COLUMN_TYPE.length - 1)
            length = secondInfo.split(',')[0].trim()
            decimal = secondInfo.split(',')[1] == null ? 0 : secondInfo.split(',')[1].trim()
          }
          return {
            name: field.COLUMN_NAME,
            type: field.DATA_TYPE.toUpperCase(),
            length,
            decimal,
            defaultValue: field.COLUMN_DEFAULT,
            required: field.IS_NULLABLE === 'NO',
            isPrimaryKey: field.COLUMN_KEY === 'PRI',
            isAutoIncrement: field.EXTRA === 'auto_increment',
            comment: field.COLUMN_COMMENT
          }
        }))
      })
    })
  }
}

module.exports = new MySQL()
