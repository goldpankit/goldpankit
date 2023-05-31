const request = require('../utils/request.define')
const service = require('../core/service')

// 创建服务
request.post('/service/create').proxy()

// 搜索服务
request.post('/service/search').proxy()

// 初始化服务
request
  .post('/service/initialize')
  .data(req => {
    return service.initialize(req.body)
  })


/**
 * 获取服务配置
 * 1. 存在spaceName和serviceName时读取本地服务配置后获取codespace再读取服务完整配置。
 * 2. 存在codespace时直接根据codespace读取服务完整配置
 * req.body = {
 *   spaceName: '',
 *   serviceName: '',
 *   codespace: ''
 * }
 */
request
  .post('/service/config')
  .data(req => {
    return service.getServiceConfig(req.body)
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
