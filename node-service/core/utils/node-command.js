const { exec } = require('child_process');
const fs = require('../utils/fs')
const log = require('../utils/log')
module.exports = {
  /**
   * 执行node命令
   * @param dir 执行目录
   * @param command 命令
   *
   * @returns {Promise<unknown>}
   */
  exec (dir, command) {
    return new Promise((resolve, reject) => {
      const commands = command.split('\n')
      log.debug(`execute node command: ${commands.join(' && ')}`)
      exec(commands.join('&&'), {cwd: dir}, (err) => {
        if (err) {
          return reject(err)
        }
        return resolve()
      })
    })
  },
  execFile (dir, filepath) {
    const content = fs.readFile(filepath)
    return this.exec(dir, content)
  }
}
