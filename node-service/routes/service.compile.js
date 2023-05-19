const request = require('../utils/request.define')
const service = require('../core/service')
// 编译服务
request
  .post('/service/compile')
  .data(req => {
    return service.install(req.body)
  })

module.exports = request.router
