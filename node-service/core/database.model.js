const cache = require('./utils/cache')
const utils = require('./utils/index')
const response = require('./constants/response')
module.exports = {
  // 删除模型
  delete (databaseId, modelId) {
    const database = cache.datasources.get(databaseId)
    if (database == null) {
      throw new Error(`Can not found database by id ${databaseId}`)
    }
    if (database.models != null) {
      const index = database.models.findIndex(m => m.id === modelId)
      if (index === -1) {
        throw new Error(`Can not found model by id ${modelId}`)
      }
      database.models.splice(index, 1)
      cache.datasources.save(database)
    }
  },
  // 保存模型
  create (databaseId, newModel) {
    const database = cache.datasources.get(databaseId)
    if (database == null) {
      return Promise.reject(response.DATA_SOURCE.NOT_EXISTS)
    }
    if (database.models == null) {
      database.models = []
    }
    // 验证名称
    const model = database.models.find(m => m.name === newModel.name)
    if (model != null) {
      return Promise.reject(response.DATA_SOURCE.MODEL_NAME_EXISTS)
    }
    newModel.id = utils.generateId()
    database.models.push(newModel)
    cache.datasources.save(database)
    return newModel.id
  },
  // 保存模型
  update (databaseId, newModel) {
    const database = cache.datasources.get(databaseId)
    if (database == null) {
      return Promise.reject(response.DATA_SOURCE.NOT_EXISTS)
    }
    if (database.models == null) {
      database.models = []
    }
    const model = database.models.find(m => m.id === newModel.id)
    if (model == null) {
      return Promise.reject(response.DATA_SOURCE.MODEL_NOT_EXISTS)
    }
    Object.assign(model, newModel)
    cache.datasources.save(database)
  }
}
