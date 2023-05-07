const request = require('../utils/request')

// test api
request
  .get('/test')
  .send('你好')

module.exports = request.router
