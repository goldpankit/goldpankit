const request = require('../utils/request.define')
const serviceCompile = require('../core/service.compile')
const serviceBuild = require('../core/service.build')
const serviceFile = require('../core/service.file')
// 构建服务
request
  .post('/service/build')
  .data(req => {
    return serviceBuild.build(req.body)
  })
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

// 清空编译服务文件
request
  .post('/service/compile/clean')
  .data(req => {
    return serviceCompile.cleanCompile(req.body)
  })

// 合并
request
  .post('/service/files/merge')
  .data(req => {
    return serviceFile.writeDiffFiles(req.body)
  })
module.exports = request.router
