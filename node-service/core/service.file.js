const Const = require('./constants/constants')
const cache = require('./utils/cache')
const fs = require('./utils/fs')
const object = require("./utils/object");
const serviceConf = require('./service.config')
module.exports = {
  // 获取文件设置
  getFileSetting (codespace, fileRelativePath) {
    const configPath = serviceConf.__getConfigPath(codespace)
    const config = fs.readJSONFile(configPath)
    const setting = JSON.parse(JSON.stringify(Const.SERVICE_FILE_CONFIG_CONTENT))
    let targetSettings = config.settings.find(file => file.path === fileRelativePath)
    if (targetSettings != null) {
      object.merge(targetSettings, setting)
    }
    // 没有设置过的文件不会产生配置文件，此时path为空，此处设定path值
    setting.path = fileRelativePath
    // 如果当前文件的编译模式为空，找出实际编译模式（为空时继承上级编译模式）
    setting._actualCompiler = setting.compiler
    if (setting.compiler == null || setting.compiler === '') {
      // 先按照路径的层级进行倒序排列，然后依次startsWith，找出最近的上级节点
      config.settings.sort((item1, item2) => {
        const item1Level = item1.path.split('/').length
        const item2Level = item2.path.split('/').length
        return item2Level - item1Level
      })
      for (const item of config.settings) {
        if (setting.path.startsWith(item.path) && item.compiler != null && item.compiler !== '') {
          setting._actualCompiler = item.compiler
          break
        }
      }
      // 如果没有匹配到上级设置了编译器，则使用服务编译器
      if (setting._actualCompiler == null || setting._actualCompiler === '') {
        setting._actualCompiler = config.compiler
      }
    }
    return setting
  },
}
