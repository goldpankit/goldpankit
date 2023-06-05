const request = require('../utils/request.define')
const serviceCompile = require('../core/service.compile')
// 安装服务
request
  .post('/service/install')
  .data(req => {
    return serviceCompile.install(req.body)
  })

// 卸载服务
request
  .post('/service/uninstall')
  .data(req => {
    return serviceCompile.uninstall(req.body)
  })

// 编译服务文件
request
  .post('/service/compile')
  .data(req => {
    return serviceCompile.compile(req.body)
  })

module.exports = request.router
