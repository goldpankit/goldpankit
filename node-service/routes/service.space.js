const request = require('../utils/request.define')

// 创建
request.post('/service/space/create').proxy()

// 根据ID查询
request.get('/service/space/:spaceId').proxy()

module.exports = request.router
