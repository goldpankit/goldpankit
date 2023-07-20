const request = require('../utils/request.define')
const database = require('../core/database')

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

module.exports = request.router
