const request = require('../utils/request.define')
const plugin = require('../core/plugin')
const serviceTranslator = require('../core/service.translator')

// 获取所有本地服务
request
  .get('/plugin/list')
  .data(req => {
    return plugin.getLocalPlugins()
  })
// 初始化服务
request
  .post('/plugin/initialize')
  .data(req => {
    return plugin.initialize(req.body)
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
  .post('/plugin/config')
  .data(req => {
    return plugin.getServiceConfig(req.body)
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
  .post('/plugin/config/save')
  .data(req => {
    return plugin.savePluginConfig(req.body)
  })

// 查询服务信息
request
  .post('/plugin/profile')
  .data ((req) => {
    return plugin.getProfile(req.body.spaceName, req.body.serviceName, req.body.pluginName)
  })

// 查询服务文件
request
  .post('/plugin/files')
  .data ((req) => {
    return plugin.getFileTree(req.body.space, req.body.service, req.body.plugin)
  })

// 保存文件配置
request
  .post('/plugin/file/setting/save')
  .data(req => {
    plugin.saveFileSetting(req.body)
  })

// 保存服务变量
request
  .post('/plugin/variables/save')
  .data(req => {
    plugin.saveVariables(req.body)
  })

module.exports = request.router