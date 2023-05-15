const request = require('../utils/request.define')

// 创建
request.post('/service/space/create').proxy()

module.exports = request.router
