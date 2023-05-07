const request = require('../utils/request')

// test api
request
  .get('/test2')
  .send('你好2')

module.exports = request.router
