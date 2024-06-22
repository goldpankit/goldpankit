const utils = require('./utils/index')
const projectDatabase = require('./project.database')
module.exports = {
  // 查询模型
  findAll (projectId, databaseId) {
    const database = projectDatabase.getDatabase(projectId, databaseId)
    if (database == null) {
      return Promise.reject(new Error(`找不到数据库，请刷新后重试！数据库ID: ${databaseId}`))
    }
    return database.models
  },
  // 删除模型
  delete (projectId, databaseId, modelId) {
    const database = projectDatabase.getDatabase(projectId, databaseId)
    if (database == null) {
      return Promise.reject(new Error(`找不到数据库，请刷新后重试！数据库ID: ${databaseId}`))
    }
    const index = database.models.findIndex(m => m.id === modelId)
    if (index === -1) {
      return Promise.reject(new Error(`找不到模型，请刷新后重试！模型ID: ${modelId}`))
    }
    // 执行删除
    database.models.splice(index, 1)
    // 保存
    projectDatabase.saveDatabase(projectId, database)
  },
  // 保存模型
  create (projectId, databaseId, newModel) {
    const database = projectDatabase.getDatabase(projectId, databaseId)
    if (database == null) {
      return Promise.reject(new Error(`找不到数据库，请刷新后重试！数据库ID: ${databaseId}`))
    }
    if (database.models == null) {
      database.models = []
    }
    // 验证名称
    const model = database.models.find(m => m.name === newModel.name)
    if (model != null) {
      return Promise.reject(new Error('模型名称不可重复！'))
    }
    // 添加模型
    newModel.id = utils.generateId()
    database.models.push(newModel)
    // 保存
    projectDatabase.saveDatabase(projectId, database)
    return newModel.id
  },
  // 保存模型
  update (projectId, databaseId, newModel) {
    // 验证数据库
    const database = projectDatabase.getDatabase(projectId, databaseId)
    if (database == null) {
      return Promise.reject(new Error(`找不到数据库，请刷新后重试！数据库ID: ${databaseId}`))
    }
    if (database.models == null) {
      database.models = []
    }
    // 验证模型是否存在
    const model = database.models.find(m => m.id === newModel.id)
    if (model == null) {
      return Promise.reject(new Error(`找不到模型，请刷新后重试！模型ID: ${newModel.id}`))
    }
    // 修改信息
    Object.assign(model, newModel)
    // 保存
    projectDatabase.saveDatabase(projectId, database)
  }
}
