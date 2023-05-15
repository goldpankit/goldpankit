const request = require('../utils/request.define')

// 创建
request.post('/service/create').proxy()

module.exports = request.router
