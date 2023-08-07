const request = require('../utils/request.define')
const pkg = require('../package.json')

// 查询客户端版本
request
  .get('/client/version')
  .data(() => {
    return pkg.version
  })

module.exports = request.router
