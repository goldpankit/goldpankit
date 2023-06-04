const { exec } = require('child_process');

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
      exec(command, {cwd: dir}, (err) => {
        if (err) {
          return reject(err)
        }
        return resolve()
      })
    })
  }
}
