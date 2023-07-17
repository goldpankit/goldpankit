const request = require('../utils/request.define')

request.post('/usr/login/password').proxy()

// 保存令牌
request
  .post('/usr/token/save')
  .data(req => {

  })

module.exports = request.router
