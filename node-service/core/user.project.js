const cache = require('./utils/cache')
const utils = require('./utils/index')
module.exports = {
  // 创建
  create (project) {
    project.id = utils.generateId()
    cache.projects.add(project)
    return project.id
  },
  // 查询项目信息
  findById (id) {
    const localInfo = cache.projects.get(id)
    localInfo.codespace
  },
  // 搜索
  search () {
    return cache.projects.search()
  },
  // 获取配置文件
  __getConfigPath (codespace) {
    return `${codespace}/`
  }
}
