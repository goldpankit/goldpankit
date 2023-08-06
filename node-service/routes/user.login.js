const request = require('../utils/request.define')
const userToken = require('../core/user.token')
const UserApi = require('../core/api/user')

// 退出登录
request
  .get('/usr/logout')
  .data(req => {
    userToken.clear()
    UserApi.logout()
  })

module.exports = request.router
