const request = require('../utils/request.define')
const projectService = require('../core/project')
// 查询项目详细信息
request
  .get('/project/:projectId')
  .data(req => {
    return projectService.findDetailById(req.params.projectId)
  })
// 查询项目配置信息
request
  .get('/project/:projectId/config')
  .data(req => {
    return projectService.findConfigById(req.params.projectId)
  })
// 创建项目
request
  .post('/project/create')
  .data(req => {
    return projectService.create(req.body)
  })
// 保存项目
request
  .post('/project/save')
  .data(req => {
    return projectService.save(req.body)
  })
// 删除项目
request
  .get('/project/delete/:projectId')
  .data(req => {
    return projectService.deleteProject(req.params.projectId)
  })
// 搜索项目
request
  .post('/project/search')
  .data(req => {
    return projectService.search(req.body)
  })

module.exports = request.router
