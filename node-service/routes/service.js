const request = require('../utils/request.define')
const axios = require('../utils/request.axios')
const cache = require('../core/utils/cache')
const service = require('../core/service')

// 创建服务
request.post('/service/create').proxy()

// 搜索服务
request.post('/service/search').proxy()

// 获取服务配置
request
  .get('/service/:serviceId/config')
  .data(req => {
    return service.getServiceConfig(req.params.serviceId)
  })

// 查询服务信息
request
  .post('/service/profile')
  .data ((req) => {
    return service.getProfile(req.body.spaceName, req.body.serviceName)
  })

// 查询服务文件
request
  .get('/service/:serviceId/files')
  .data ((req) => {
    return service.getFileTree(req.params.serviceId)
  })

// 保存文件配置
request
  .post('/service/file/setting/save')
  .data(req => {
    service.saveFileSetting(req.body)
  })

// 保存服务变量
request
  .post('/service/variables/save')
  .data(req => {
    service.saveVariables(req.body)
  })

module.exports = request.router
