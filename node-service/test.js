const mysql = require('./core/utils/db/mysql')
const fs = require('fs')

mysql.exec({
  host: 'www.threebody.vip',
  port: 3306,
  user: 'root',
  password: 'Yry_abc_123',
  database: 'tzjg'
}, `SELECT ROUTINE_NAME, ROUTINE_DEFINITION FROM information_schema.routines WHERE ROUTINE_TYPE = 'PROCEDURE' AND ROUTINE_SCHEMA = 'tzjg'`)
  .then(rows => {
    for (const row of rows) {
      const content = `create definer = root@\`%\` procedure ${row.ROUTINE_NAME}()\n`
      fs.writeFileSync(`/Users/caesar/Downloads/sqls/${row.ROUTINE_NAME}.sql`, `${content}${row.ROUTINE_DEFINITION}`)
    }
  })
  .catch(e => {
    console.error(e)
  })
