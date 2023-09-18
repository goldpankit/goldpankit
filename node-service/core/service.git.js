const git = require('./utils/git')
const serviceConf = require('./service.config')
const service = require('./service')
const plugin = require('./plugin')
const fs = require('./utils/fs')
const path = require('path')
module.exports = {
  /**
   * 从GIT中克隆服务代码
   * @param dto
   */
  clone (dto) {
    const serviceConfig = serviceConf.getServiceConfig(dto)
    const serviceDir = serviceConfig.codespace
    // 删除服务目录下的所有文件
    fs.clearDir(serviceConfig.codespace)
    return new Promise((resolve, reject) => {
      git.clone({
        url: serviceConfig.repository,
        branch: serviceConfig.branch,
        targetDir: serviceDir
      })
        .then(() => {
          // 读取README文件，将其写入服务介绍和服务说明中
          const files = fs.getFiles(serviceDir)
          const readmeFile = files.find(file => file === 'README.md')
          if (readmeFile != null) {
            const result = fs.readFile(path.join(serviceDir, readmeFile))
            // 文本内容
            if (result.encode === 'utf-8') {
              serviceConfig.readme = result.content
              serviceConfig.introduce = result.content.substring(0, 200)
            }
          }
          resolve()
        })
        .catch(e => {
          reject(e)
        })
        .finally(() => {
          // 重新初始化
          // - 插件
          if (dto.plugin != null) {
            service.initialize(serviceConfig)
          }
          // - 服务
          else {
            plugin.initialize(serviceConfig)
          }
        })
    })
  }
}
