const db = require('./db/mysql')
const nc = require('./node-command')

nc.exec('/Users/caesar/Downloads/test', 'npm install mysql')
  .then(() => {
    console.log('node command exec completed.')
  })
  .catch(e => {
    console.log('e', e)
  })
