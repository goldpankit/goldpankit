const request = require('../utils/request.define')
const service = require('../core/service')
const serviceGit = require('../core/service.git')
const serviceTranslator = require('../core/service.translator')

// 获取所有本地服务
request
  .post('/service/git/clone')
  .data(req => {
    return serviceGit.clone(req.body)
  })

// 获取所有本地服务
request
  .get('/service/list')
  .data(req => {
    return service.getLocalServices()
  })
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
 *   space: '',
 *   service: '',
 *   codespace: ''
 * }
 */
request
  .post('/service/config')
  .data(req => {
    return service.getServiceConfig(req.body)
  })

/**
 * 保存服务配置
 * req.body = {
 *   space: '',
 *   service: '',
 *   ...配置信息
 * }
 */
request
  .post('/service/config/save')
  .data(req => {
    return service.saveServiceConfig(req.body)
  })

/**
 * 翻译服务
 * req.body = {
 *   space: '',
 *   service: ''
 * }
 */
request
  .post('/service/translate')
  .data(req => {
    return serviceTranslator.translate(req.body)
  })

// 查询服务信息
request
  .post('/service/profile')
  .data ((req) => {
    return service.getProfile(req.body.spaceName, req.body.serviceName)
  })

// 查询服务文件
request
  .post('/service/files')
  .data ((req) => {
    return service.getFileTree(req.body.space, req.body.service)
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
