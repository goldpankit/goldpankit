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
          const upgradeCommandTip = `npm install goldpankit@${latestVersion.versionNo} -g --registry https://registry.npmjs.org\nOR\nsudo npm install goldpankit@${latestVersion.versionNo} -g --registry https://registry.npmjs.org`
          log.tip(`正在使用命令 '${upgradeCommand}' 进行自动升级, 请稍等！`)
          node.exec(process.cwd(), upgradeCommand)
            .then(() => {
              log.success(`升级完成，最新版本为 ${latestVersion.versionNo}。现在你可以重新执行 'kit' 命令来打开kit。如果反复出现此消息，请尝试手动执行以下命令！。\n\`\`\`\n${upgradeCommandTip}\n\`\`\``)
              resolve(true)
            })
            .catch(e => {
              log.error(`自动升级失败. 你可以手动执行以下命令来进行升级。\n\`\`\`\n${upgradeCommandTip}\n\`\`\`\n如果总是升级失败，请尝试使用超级管理员权限或更换node版本！`)
              reject(e)
            })
        })
        .catch(() => {
          reject('获取最新的版本信息失败，请稍后重试！')
        })
    })
  }
}
