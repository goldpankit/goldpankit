const request = require('../utils/request.define')
const service = require('../core/service')
/**
 * 安装服务
 * req.body = {
 *   projectId: '', // 当前选择的项目ID
 *   database: '', // 当前选择的数据库名称
 *   space: '',
 *   service: '',
 *   version: '',
 *   variables: []
 * }
 */
request
  .post('/service/install')
  .data(req => {
    return service.install(req.body)
  })

// 卸载服务
request
  .post('/service/uninstall')
  .data(req => {
    return service.uninstall(req.body)
  })

// 编译服务文件
request
  .post('/service/compile')
  .data(req => {
    return service.compile(req.body)
  })

module.exports = request.router
