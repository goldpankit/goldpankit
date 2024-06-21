const request = require('../utils/request.define')
const userProjectDatabase = require('../core/user.project.database')

// 查询项目数据库
request
  .get('/usr/project/databases/:projectId')
  .data(req => {
    return userProjectDatabase.getProjectDatabaseConfigByIdWithDefaultBlankArray(req.params.projectId)
  })

// 新建
request
  .post('/usr/project/database/create')
  .data(req => {
    return userProjectDatabase.create(req.body)
  })

// 编辑
request
  .post('/usr/project/database/updateById')
  .data(req => {
    return userProjectDatabase.updateById(req.body)
  })

// 删除
request
  .post('/usr/project/database/delete')
  .data(req => {
    return userProjectDatabase.deleteById(req.body)
  })

module.exports = request.router
