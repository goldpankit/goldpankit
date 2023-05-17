const request = require('../utils/request.define')
const cache = require('../core/utils/cache')
const globalConfig = require('../core/global.config')
request.post('/service/create').proxy()
request
  .post('/service/initialize')
  .data((req) => {
    const dir = req.body.dir
    cache.set('SERVICE_ROOT', dir)
    globalConfig.build(req.body)
  })

module.exports = request.router
