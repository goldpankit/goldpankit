const request = require('../utils/request.define')
const plugin = require('../core/plugin')

// 初始化插件
request
  .post('/plugin/initialize')
  .data(req => {
    return plugin.initialize(req.body)
  })


/**
 * 获取插件配置
 * 1. 存在space、service和plugin时读取本地插件配置后获取codespace再读取服务完整配置。
 * 2. 存在codespace时直接根据codespace读取服务完整配置
 * req.body = {
 *   space: '',
 *   service: '',
 *   plugin: '',
 *   codespace: ''
 * }
 */
request
  .post('/plugin/config')
  .data(req => {
    return plugin.getPluginConfig(req.body)
  })

/**
 * 保存插件配置
 * req.body = {
 *   space: '',
 *   service: '',
 *   plugin: ''
 *   ...配置信息
 * }
 */
request
  .post('/plugin/config/save')
  .data(req => {
    return plugin.savePluginConfig(req.body)
  })

// 查询插件信息
request
  .post('/plugin/profile')
  .data ((req) => {
    return plugin.getProfile(req.body.spaceName, req.body.serviceName, req.body.pluginName)
  })

// 查询插件文件
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
