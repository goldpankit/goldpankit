const fs = require("fs");
const Const = require("./constants/constants");
const path = require("path");
module.exports = {
  getFiles (absolutePath) {
    let filePool = []
    const files = fs.readdirSync(absolutePath)
    files.forEach(file => {
      // 忽略文件
      if (Const.IGNORE_DIRS.findIndex(f => file === f || file.startsWith(`${f}/`)) !== -1) {
        return
      }
      // 全路径
      const fullpath = path.join(absolutePath, file)
      // 相对路径
      filePool.push(file);
      if (this.isDirectory(fullpath)) {
        const subfiles = this.getFiles(fullpath);
        filePool = filePool.concat(subfiles);
      }
    });
    return filePool
  },
  isDirectory (filepath) {
    return fs.statSync(filepath).isDirectory()
  },
  isFile (filepath) {
    return fs.statSync(filepath).isFile()
  }
}
