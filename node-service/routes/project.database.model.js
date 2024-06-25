const request = require('../utils/request.define')
const projectDatabaseModel = require('../core/project.database.model')

// 查询模型
request
  .post('/project/database/models')
  .data(req => {
    return projectDatabaseModel.findAll(req.body.projectId, req.body.databaseId)
  })

// 创建模型
request
  .post('/project/database/model/create')
  .data(req => {
    return projectDatabaseModel.create(req.body.projectId, req.body.databaseId, req.body.model)
  })

// 修改模型
request
  .post('/project/database/model/update')
  .data(req => {
    return projectDatabaseModel.update(req.body.projectId, req.body.databaseId, req.body.model)
  })

// 删除模型
request
  .post('/project/database/model/delete')
  .data(req => {
    return projectDatabaseModel.delete(req.body.projectId, req.body.databaseId, req.body.modelId)
  })

module.exports = request.router
