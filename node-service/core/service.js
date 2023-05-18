const path = require('path')
const Const = require('./constants/constants')
const cache = require('./utils/cache')
const fs = require('./utils/fs')
const serviceApi = require("./api/service");
module.exports = {
  // 初始化
  initialize(extConfig) {
    // 配置
    const config = JSON.parse(JSON.stringify(Const.SERVICE_CONFIG_CONTENT))
    // 配置文件
    const codespace = extConfig.codespace
    const configPath = `${codespace}/${Const.SERVICE_CONFIG_FILE}`
    // 合并配置
    for (const key in config) {
      config[key] = extConfig[key] || config[key]
    }
    serviceApi.initialize(config.id)
      .then(() => {
        // 初始化服务文件
        fs.createFile(configPath, fs.toJSONFileString(config), true)
        // 添加本地服务记录
        cache.services.add({
          id: config.id,
          codespace
        })
      })
      .catch(e => {
        throw e
      })
  },
  // 获取文件树
  getFileTree (serviceId) {
    const codespace = service.codespace
    const service = cache.services.get(serviceId)
    let filePool = []
    const files = fs.getFiles(codespace)
    files.forEach(file => {
      // 忽略文件
      if (Const.IGNORE_DIRS.findIndex(f => file === f || file.startsWith(`${f}/`)) !== -1) {
        return
      }
      // 全路径
      const fullpath = path.join(codespace, file)
      const fileObject = {
        label: file,
        type: fs.isDirectory(fullpath) ? 'directory' : 'file',
        filetype: fs.getFiletype(fullpath),
        path: fullpath,
        children: []
      }
      filePool.push(fileObject);
      if (fileObject.type === 'directory') {
        fileObject.children = this.getFileTree(fullpath);
      }
    });
    return filePool
  }
}
