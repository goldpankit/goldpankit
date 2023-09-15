const Const = require('./constants/constants')
const cache = require('./utils/cache')
const fs = require('./utils/fs')
const path = require('path')
module.exports = {
  // 获取服务配置信息
  getServiceConfig(dto) {
    console.log('getServiceConfig', dto)
    // 获取插件配置信息
    if (dto.space != null && dto.service != null && dto.plugin != null) {
      const plugin = cache.plugins.get(dto.space, dto.service, dto.plugin)
      if (plugin == null) {
        return null
      }
      return {
        ...this.__getServiceConfig(plugin.codespace),
        repository: plugin.repository
      }
    }
    // 获取服务配置信息
    if (dto.space != null && dto.service != null) {
      const service = cache.services.get(dto.space, dto.service)
      if (service == null) {
        return null
      }
      return {
        ...this.__getServiceConfig(service.codespace),
        repository: service.repository
      }
    }
    if (dto.codespace != null) {
      return this.__getServiceConfig(dto.codespace)
    }
    return null
  },
  // 获取文件配置目录
  __getConfigPath (codespace) {
    return path.join(codespace, Const.SERVICE_CONFIG_DIRECTORY, Const.SERVICE_CONFIG_FILE)
  },
  // 获取服务配置
  __getServiceConfig (codespace) {
    const configPath = this.__getConfigPath(codespace)
    return {
      ...fs.readJSONFile(configPath),
      codespace
    }
  }
}
