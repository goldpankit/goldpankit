const mysql = require('./db/mysql')
const nc = require('./node-command')

// nc.exec('/Users/caesar/Downloads/test', 'npm install mysql')
//   .then(() => {
//     console.log('node command exec completed.')
//   })
//   .catch(e => {
//     console.log('e', e)
//   })

mysql.getTables({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'local@123',
  database: 'db_eva'
}, true)
  .then(table => {
    console.log(JSON.stringify(table, null, 2))
  })
  .catch(e => {
    console.log('e', e)
  })
