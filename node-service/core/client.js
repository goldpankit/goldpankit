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
            resolve(false)
            return
          }
          // 执行升级命令
          const upgradeCommand = `npm install goldpankit@${latestVersion.versionNo} -g --registry https://registry.npmjs.org`
          log.tip(`We are currently using command '${upgradeCommand}' for automatic upgrade, please wait a moment.`)
          node.exec(process.cwd(), upgradeCommand)
            .then(() => {
              log.success(`The automatic upgrade is complete. The latest version is ${latestVersion.versionNo}. and now, you can try re-running the 'kit' command to launch the kit. if you see this message repeatedly, please try manually executing the following command to complete the upgrade.\n\`\`\`\n${upgradeCommand}\n\`\`\``)
              resolve(true)
            })
            .catch(e => {
              log.error(`Automatic upgrade failed. You can manually execute the following commands to attempt an upgrade.\n\`\`\`\n${upgradeCommand}\n\`\`\`\nIf you still cannot complete the upgrade, please try using superuser privileges to execute or adjust your node version.`)
              reject(e)
            })
        })
        .catch(() => {
          reject('Failed to obtain version information, please try again later.')
        })
    })
  }
}
