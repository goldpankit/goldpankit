const request = require('../utils/request.define')

// 创建服务
request.post('/usr/service/create').proxy()

module.exports = request.router
