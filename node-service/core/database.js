const cache = require('./utils/cache')
const utils = require('./utils/index')
module.exports = {
  // 搜索
  search (pageWrap) {
    return cache.datasources.search(pageWrap)
  },
  // 创建
  create (database) {
    const databases = cache.datasources.getAll()
    const existsDatabase = databases.find(db => db.name === database.name)
    if (existsDatabase != null) {
      return Promise.reject('数据源名称已存在')
    }
    database.id = utils.generateId()
    cache.datasources.save(database)
    return Promise.resolve(database.id)
  },
  // 保存
  updateById (config) {
    const database = cache.datasources.get(config.id)
    if (database == null) {
      throw new Error('未找到数据库信息')
    }
    Object.assign(database, config)
    cache.datasources.save(database)
  },
  // 删除
  deleteById(databaseId) {
    cache.datasources.remove(databaseId)
  }
}
