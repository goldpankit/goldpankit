const request = require('../utils/request.define')
const userProject = require('../core/user.project')
// 查询项目详细信息
request
  .get('/usr/project/:projectId')
  .data(req => {
    return userProject.findDetailById(req.params.projectId)
  })
// 查询项目配置信息
request
  .get('/usr/project/:projectId/config')
  .data(req => {
    return userProject.findConfigById(req.params.projectId)
  })
// 创建项目
request
  .post('/usr/project/create')
  .data(req => {
    return userProject.create(req.body)
  })
// 保存项目
request
  .post('/usr/project/save')
  .data(req => {
    return userProject.save(req.body)
  })
// 删除项目
request
  .get('/usr/project/delete/:projectId')
  .data(req => {
    return userProject.deleteProject(req.params.projectId)
  })
// 搜索项目
request
  .post('/usr/project/search')
  .data(req => {
    return userProject.search(req.body)
  })

module.exports = request.router
