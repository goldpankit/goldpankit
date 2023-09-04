const cache = require('./utils/cache')
const utils = require('./utils/index')
const response = require('./constants/response')
module.exports = {
  // 搜索
  search (pageWrap) {
    return cache.datasources.search(pageWrap)
  },
  // 创建
  create (database) {
    // 验证名称
    const databases = cache.datasources.getAll()
    const existsDatabase = databases.find(db => db.name.toLowerCase() === database.name.toLowerCase())
    if (existsDatabase != null) {
      return Promise.reject(response.DATA_SOURCE.NAME_EXISTS)
    }
    // 创建
    database.id = utils.generateId()
    cache.datasources.save(database)
    return Promise.resolve(database.id)
  },
  // 保存
  updateById (newDataSource) {
    // 验证数据
    const dataSource = cache.datasources.get(newDataSource.id)
    if (dataSource == null) {
      return Promise.reject(response.DATA_SOURCE.NOT_EXISTS)
    }
    // 验证名称
    const databases = cache.datasources.getAll()
    const existsDatabase = databases.find(db => db.name.toLowerCase() === newDataSource.name.toLowerCase())
    if (existsDatabase != null && existsDatabase.id !== newDataSource.id) {
      return Promise.reject(response.DATA_SOURCE.NAME_EXISTS)
    }
    // 保存
    Object.assign(dataSource, newDataSource)
    cache.datasources.save(dataSource)
  },
  // 删除
  deleteById(databaseId) {
    cache.datasources.remove(databaseId)
  }
}
