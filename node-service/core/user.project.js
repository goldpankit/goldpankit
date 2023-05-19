const cache = require('./utils/cache')
const utils = require('./utils/index')
module.exports = {
  // 创建
  create (project) {
    project.id = utils.generateId()
    cache.projects.add(project)
    return project.id
  },
  // 搜索
  search () {
    return cache.projects.search()
  }
}
