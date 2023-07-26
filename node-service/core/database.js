const cache = require('./utils/cache')
const utils = require('./utils/index')
module.exports = {
  // 搜索
  search (pageWrap) {
    return cache.databases.search(pageWrap)
  },
  // 创建
  create (database) {
    database.id = utils.generateId()
    cache.databases.save(database)
    return database.id
  },
  // 保存
  updateById (config) {
    const database = cache.databases.get(config.id)
    if (database == null) {
      throw new Error('未找到数据库信息')
    }
    Object.assign(database, config)
    cache.databases.save(database)
  },
  // 删除
  deleteById(databaseId) {
    cache.databases.remove(databaseId)
  }
}
