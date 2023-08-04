const clientApi = require('./api/client')
const pkg = require('../package')
const node = require('./utils/node-command')
const log = require('./utils/log')
module.exports = {
  /**
   * 自动升级
   */
  autoUpgrade () {
    return new Promise((resolve, reject) => {
      clientApi.getLatestVersion()
        .then(latestVersion => {
          // 版本号相同（已是最新），不做处理
          if (pkg.version === latestVersion.versionNo) {
            resolve()
            return
          }
          // 执行升级命令
          log.tip('Start automatic upgrade')
          node.exec(process.cwd(), `npm uninstall goldpankit -g\nnpm install goldpankit -g`)
            .then(() => {
              log.tip('The automatic upgrade is complete. The latest version is v2.0.0. If the upgrade was not successful, please manually execute the command \'npm uninstall goldpankit -g && npm install goldpankit -g\'.')
              resolve()
            })
            .catch(e => {
              log.error('Automatic upgrade failed.')
              reject(e)
            })
        })
        .catch(() => {
          reject('Get version of gold pan kit failed.')
        })
    })
  }
}
