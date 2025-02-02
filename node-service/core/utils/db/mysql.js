const mysql = require('mysql');
const fs = require('../fs')
const sqlFormatter = require('sql-formatter')

class MySQL {
  constructor() {
  }

  /**
   * 格式化sql语句
   * @param sql sql语句
   * @returns {string} 格式化好后的语句
   */
  format (sql) {
    return sqlFormatter.format(sql)
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
      const connection = mysql.createConnection({
        ...config,
        multipleStatements: true
      })
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
  // 执行文件
  execFile (config, filepath) {
    const sql = fs.readFile(filepath).content
    return this.exec(config, sql)
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
                  return
                }
                if (tables == null || tables.length === 0) {
                  reject(`找不到数据库表 ${table}`)
                  return
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
        .catch(e => {
          reject(e)
        })
    })
  }
  // 检查书库是否存在
  checkDatabase (config, databaseName) {
    return new Promise((resolve, reject) => {
      // 连接数据库
      this.connect(config)
        .then(conn => {
          // 执行检测语句
          conn.query(
            `SHOW DATABASES;`,
            (error, records) => {
              conn.end()
              if (error) {
                return reject(error.sqlMessage)
              }
              if (records.find(r => r.Database === databaseName)) {
                resolve(true)
              }
              resolve(false)
            })
        })
        .catch(e => {
          reject(e)
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
            // 如果表字段存在unsigned或zerofil的设定，则length可能为“11) unsigned zerofil 11)”，此时需要抽取出这里的数字作为长度
            length = length.match(/\d+/) ? length.match(/\d+/)[0] : length
            decimal = secondInfo.split(',')[1] == null ? 0 : secondInfo.split(',')[1].trim()
            // 如果表字段存在unsigned或zerofil的设定，则length可能为“4,2) unsigned zerofil 11)”，此时需要抽取出这里的数字作为长度
            if (typeof decimal === 'string') {
              decimal = decimal.match(/\d+/) ? decimal.match(/\d+/)[0] : decimal
            }
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
