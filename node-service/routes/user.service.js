const request = require('../utils/request.define')
const service = require('../core/service')

// 删除服务
request
  .post('/usr/service/delete')
  .data(req => {
    return service.deleteService(req.body)
  })

module.exports = request.router
