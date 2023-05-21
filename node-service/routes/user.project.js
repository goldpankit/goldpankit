const request = require('../utils/request.define')
const userProject = require('../core/user.project')
// 查询项目信息
request
  .get('/usr/project/:projectId')
  .data(req => {
    return userProject.findById(req.params.projectId)
  })
// 创建项目
request
  .post('/usr/project/create')
  .data(req => {
    console.log('create project', req.body)
    return userProject.create(req.body)
  })
// 搜索项目
request
  .post('/usr/project/search')
  .data(req => {
    return userProject.search(req.body)
  })

module.exports = request.router
