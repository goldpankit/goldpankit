const cache = require('./utils/cache')
module.exports = {
  // 删除模型
  delete (databaseId, modelName) {
    const database = cache.databases.get(databaseId)
    if (database == null) {
      throw new Error(`Can not found database by id ${databaseId}`)
    }
    if (database.models != null) {
      const index = database.models.findIndex(m => m.name === modelName)
      if (index !== -1) {
        database.models.splice(index, 1)
        cache.databases.save(database)
      }
    }
  },
  // 保存模型
  create (databaseId, newModel) {
    const database = cache.databases.get(databaseId)
    if (database == null) {
      throw new Error(`Can not found database by id ${databaseId}`)
    }
    if (database.models == null) {
      database.models = []
    }
    const model = database.models.find(m => m.name === newModel.name)
    if (model != null) {
      throw new Error(`the model named ${newModel.name} already exists.`)
    }
    database.models.push(newModel)
    cache.databases.save(database)
  },
  // 保存模型
  update (databaseId, newModel) {
    const database = cache.databases.get(databaseId)
    if (database == null) {
      throw new Error(`Can not found database by id ${databaseId}`)
    }
    if (database.models == null) {
      database.models = []
    }
    const model = database.models.find(m => m.name === newModel.name)
    if (model == null) {
      throw new Error(`Can not found model named ${newModel.name}`)
    }
    cache.databases.save(database)
  }
}
