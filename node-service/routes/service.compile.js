const request = require('../utils/request.define')
const service = require('../core/service')
// 安装服务
request
  .post('/service/install')
  .data(req => {
    return service.install(req.body)
  })

// 编译服务文件
request
  .post('/service/compile')
  .data(req => {
    return service.compile(req.body)
  })

module.exports = request.router
