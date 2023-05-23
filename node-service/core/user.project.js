const cache = require('./utils/cache')
const utils = require('./utils/index')
const fs = require('./utils/fs')
const Const = require("./constants/constants");
module.exports = {
  // 创建
  create (project) {
    project.id = utils.generateId()
    cache.projects.add(project)
    return project.id
  },
  // 查询项目信息
  findById (id) {
    const project = cache.projects.get(id)
    const projectConfig = fs.readJSONFile(this.__getConfigPath(project.codespace))
    return {
      ...project,
      ...projectConfig
    }
  },
  // 搜索
  search () {
    return cache.projects.search()
  },
  // 获取项目配置文件路径
  getConfigPath (projectId) {
    const project = cache.projects.get(projectId)
    return this.__getConfigPath(project.codespace)
  },
  // 获取配置文件
  __getConfigPath (codespace) {
    return `${codespace}/${Const.PROJECT_CONFIG_FILE}`
  }
}
