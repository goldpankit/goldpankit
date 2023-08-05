const request = require('../utils/request.define')
const userToken = require('../core/user.token')
const UserApi = require('../core/api/user')

// 获取余额
request.get('/usr/balance').proxy()

module.exports = request.router
