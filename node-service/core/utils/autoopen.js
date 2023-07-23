const root = process.cwd()
const open = require('opn')
const fs = require('./fs')
const Const = require('../constants/constants')
const cache = require('./cache')
module.exports = {
  open (port) {
    const files = fs.getFiles(root)
    // 查找是否存在配置文件，如果存在，则自动打开workbench
    if (files.find(f => f === Const.SERVICE_CONFIG_FILE) != null) {
      const projects = cache.projects.getAll()
      const targetProject = projects.find(p => p.codespace === root)
      if (targetProject != null) {
        open(`http://localhost:${port}/workbench?project_id=${targetProject.id}`)
        return
      }
    }
    // 找不到配置文件或项目，则打开公共空间页面
    open(`http://localhost:${port}/spaces`)
  }
}
