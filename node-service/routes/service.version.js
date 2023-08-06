const request = require('../utils/request.define')
const service = require('../core/service')

/**
 * 发布服务版本
 * req.body = {
 *   space: '',
 *   service: '',
 *   pushDescription: ''
 * }
 */
request
  .post('/service/version/publish')
  .data(req => {
    return service.publish(req.body)
  })

module.exports = request.router
