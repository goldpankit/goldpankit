const Const = require('./constants/constants')
const cache = require('./utils/cache')
const fs = require('./utils/fs')
module.exports = {
  // 获取服务配置信息
  getServiceConfig(dto) {
    if (dto.space != null && dto.service != null) {
      const service = cache.services.get(dto.space, dto.service)
      if (service == null) {
        return null
      }
      return this.__getServiceConfig(service.codespace)
    }
    if (dto.codespace != null) {
      return this.__getServiceConfig(dto.codespace)
    }
    return null
  },
  // 获取文件配置目录
  __getConfigPath (codespace) {
    return `${codespace}/${Const.SERVICE_CONFIG_DIRECTORY}/${Const.SERVICE_CONFIG_FILE}`
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
