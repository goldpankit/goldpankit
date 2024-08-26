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
          const upgradeCommand = `npm install goldpankit@${latestVersion.versionNo} -g --registry https://registry.npmmirror.com`
          const upgradeCommandTip = `npm install goldpankit@${latestVersion.versionNo} -g --registry https://registry.npmmirror.com\nOR\nsudo npm install goldpankit@${latestVersion.versionNo} -g --registry https://registry.npmmirror.com`
          log.tip(`Upgrading kit to v${latestVersion.versionNo}, please wait a moment...`)
          node.exec(process.cwd(), upgradeCommand)
            .then(() => {
              log.success(`Upgrade kit to v${latestVersion.versionNo} successfully. and now you can execute 'kit' command to open KIT. If you see this message repeatedly, please try to execute the following command manually:\n\`\`\`\n${upgradeCommandTip}\n\`\`\``)
              resolve(true)
            })
            .catch(e => {
              log.error(`Upgrade kit to v${latestVersion.versionNo} failed. you can execute the following command manually:\n\`\`\`\n${upgradeCommandTip}\n\`\`\`\nIf you see this message repeatedly, please try to execute the following command manually:\n\`\`\`\n${upgradeCommandTip}\n\`\`\`\nIf multiple upgrades fail, please try to use administrator permissions or change the node version!`)
              reject(e)
            })
        })
        .catch(() => {
          reject('服务异常，请稍后重试！')
        })
    })
  }
}
