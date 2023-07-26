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
  },
  // 保存查询模型
  saveModel (databaseId, newModel) {
    const database = cache.databases.get(databaseId)
    if (database == null) {
      throw new Error(`Can not found database by id ${databaseId}`)
    }
    if (database.models == null) {
      database.models = []
    }
    const model = database.models.find(m => m.name === newModel.name)
    if (model == null) {
      database.models.push(newModel)
    } else {
      Object.assign(model, newModel)
    }
    cache.databases.save(database)
  },
}
