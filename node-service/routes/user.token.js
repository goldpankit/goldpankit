const request = require('../utils/request.define')
const userToken = require('../core/user.token')

// 获取令牌
request
  .get('/usr/token')
  .data(() => {
    return userToken.getToken()
  })

// 保存令牌
request
  .post('/usr/token/save')
  .data(req => {
    return userToken.create(req.body.token)
  })

module.exports = request.router
