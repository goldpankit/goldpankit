const Const = require('./constants/constants')
const FileUtil = require('./service')
const serviceApi = require("./api/service");
const cache = require('./utils/cache')
module.exports = {
  build(extConfig) {
    const config = JSON.parse(JSON.stringify(Const.SERVICE_CONFIG_CONTENT))
    for (const key in config) {
      config[key] = extConfig[key] || config[key]
    }
    // 将变量转为字符串
    config.variables = JSON.stringify(config.variables)
    config.select = JSON.stringify(config.select)
    serviceApi.initialize(config.id)
      .then(() => {
        // 初始化服务文件
        const newConfig = {
          ...config,
          variables: JSON.parse(config.variables),
          select: config.select == null ? null : JSON.parse(config.select)
        }
        FileUtil.createFile(this.getConfigPath(), this.toString(newConfig), true)
        // 添加本地服务记录
        cache.services.add({
          id: config.id,
          dir: FileUtil.getRoot()
        })
      })
      .catch(e => {
        throw e
      })
  },
  read() {
    const packageJsonPath = this.getConfigPath();
    if (FileUtil.exists(packageJsonPath)) {
      return JSON.parse(FileUtil.readFile(packageJsonPath))
    }
    return {}
  },
  /**
   * 重写配置
   * @param newConfig
   */
  rewrite(newConfig) {
    const config = JSON.parse(JSON.stringify(Const.SERVICE_CONFIG_CONTENT))
    const currentConfig = this.read()
    Object.assign(config, currentConfig)
    Object.assign(config, newConfig)
    FileUtil.createFile(this.getConfigPath(), this.toString(config), true)
  },
  /**
   * 获取配置文件
   * @returns {string}
   */
  getConfigPath() {
    return `${Const.CONFIG_DIR}/${Const.SERVICE_CONFIG_FILE}`
  },
  toString(config) {
    return JSON.stringify(config, null, 2)
  }
}
