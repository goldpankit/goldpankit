const gitClone = require('git-clone');

module.exports = {
  /**
   * 克隆仓库
   * @param dto = {
   *   url: 仓库地址,
   *   branch: 仓库分支/标签,
   *   targetDir: 存放路径（必须是空目录）
   * }
   * @returns {Promise<unknown>}
   */
  clone (dto) {
    return new Promise((resolve, reject) => {
      gitClone(dto.url, dto.targetDir, { checkout: dto.branch }, (err) => {
        if (err) {
          reject(err)
          return
        }
        resolve()
      });
    })
  }
}
