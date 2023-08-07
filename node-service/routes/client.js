const request = require('../utils/request.define')
const database = require('../core/database')
const databaseModel = require('../core/database.model')

// 查询分页
request
  .post('/database/search')
  .data(req => {
    return database.search(req.body)
  })

// 新建
request
  .post('/database/create')
  .data(req => {
    return database.create(req.body)
  })

// 编辑
request
  .post('/database/updateById')
  .data(req => {
    return database.updateById(req.body)
  })

// 删除
request
  .get('/database/delete/:databaseId')
  .data(req => {
    return database.deleteById(req.params.databaseId)
  })

// 创建模型
request
  .post('/database/model/create')
  .data(req => {
    return databaseModel.create(req.body.database, req.body.model)
  })

// 修改模型
request
  .post('/database/model/update')
  .data(req => {
    return databaseModel.update(req.body.database, req.body.model)
  })

// 删除模型
request
  .post('/database/model/delete')
  .data(req => {
    return databaseModel.delete(req.body.database, req.body.model)
  })

module.exports = request.router
