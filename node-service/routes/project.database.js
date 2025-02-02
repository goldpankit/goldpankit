const request = require('../utils/request.define')
const projectDatabase = require('../core/project.database')

// 查询项目数据库
request
  .get('/project/databases/:projectId')
  .data(req => {
    return projectDatabase.getProjectDatabaseConfigByIdWithDefaultBlankArray(req.params.projectId)
  })

// 新建
request
  .post('/project/database/create')
  .data(req => {
    return projectDatabase.create(req.body.projectId, req.body.database)
  })

// 编辑
request
  .post('/project/database/updateById')
  .data(req => {
    return projectDatabase.updateById(req.body.projectId, req.body.database)
  })

// 删除
request
  .post('/project/database/delete')
  .data(req => {
    return projectDatabase.deleteById(req.body.projectId, req.body.databaseId)
  })

module.exports = request.router
