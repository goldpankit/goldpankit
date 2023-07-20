const mysql = require('./utils/db/mysql')
mysql.execFile({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'local@123',
  database: 'test',
  multipleStatements: true
}, '/Users/caesar/adjustrd/goldpankit/codespace/kit-node-cli-ui/node-service/core/init.sql')
  .then(data => {
    console.log('执行成功', data)
  })
  .catch(e => {
    console.log('执行失败', e)
  })
