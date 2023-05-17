const Const = require('./constants/constants')
const FileUtil = require('./utils/file')
const serviceApi = require("./api/service");
module.exports = {
  build(extConfig) {
    const config = JSON.parse(JSON.stringify(Const.GLOBAL_CONFIG_CONTENT))
    for (const key in config) {
      config[key] = extConfig[key] || config[key]
    }
    // 将变量转为字符串
    config.variables = JSON.stringify(config.variables)
    config.select = JSON.stringify(config.select)
    console.log('服务ID', config.id)
    serviceApi.initialize(config.id)
      .then(() => {
        const newConfig = {
          ...config,
          variables: JSON.parse(config.variables),
          select: config.select == null ? null : JSON.parse(config.select)
        }
        FileUtil.createFile(this.getConfigPath(), this.toString(newConfig), true)
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
    const config = JSON.parse(JSON.stringify(Const.GLOBAL_CONFIG_CONTENT))
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
    return `${Const.CONFIG_DIR}/${Const.GLOBAL_CONFIG_NAME}`
  },
  toString(config) {
    return JSON.stringify(config, null, 2)
  }
}
