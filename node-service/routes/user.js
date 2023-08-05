const request = require('../utils/request.define')
const userToken = require('../core/user.token')
const UserApi = require('../core/api/user')

// 密码登录
request.post('/usr/login/password').proxy()
// 获取登录信息
request.get('/usr/login/info').proxy()
// 退出登录
request
  .get('/usr/logout')
  .data(req => {
    userToken.clear()
    UserApi.logout()
  })

module.exports = request.router
