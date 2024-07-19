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
          log.tip(`正在自动升级, 请稍等...`)
          node.exec(process.cwd(), upgradeCommand)
            .then(() => {
              log.success(`已升级至 v${latestVersion.versionNo}。现在你可以重新执行 'kit' 命令来打开KIT。如果反复出现此消息，请尝试手动执行以下命令：\n\`\`\`\n${upgradeCommandTip}\n\`\`\``)
              resolve(true)
            })
            .catch(e => {
              log.error(`自动升级失败. 你可以手动执行以下命令来进行升级。\n\`\`\`\n${upgradeCommandTip}\n\`\`\`\n如果多次升级失败，请尝试使用超级管理员权限或更换node版本！`)
              reject(e)
            })
        })
        .catch(() => {
          reject('服务异常，请稍后重试！')
        })
    })
  }
}
