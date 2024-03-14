const request = require('../utils/request.define')
const pkg = require('../package.json')
const cache = require('../core/utils/cache')

// 查询客户端版本
request
  .get('/client/version')
  .data(() => {
    return pkg.version
  })

// 查询语言
request
  .get('/client/lang')
  .data(() => {
    return cache.lang.get()
  })

// 修改语言
request
  .post('/client/lang/save')
  .data((req) => {
    return cache.lang.set(req.body.lang)
  })

module.exports = request.router
