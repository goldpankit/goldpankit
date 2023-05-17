const request = require('../utils/request.define')
const axios = require('../utils/request.axios')
const cache = require('../core/utils/cache')
const globalConfig = require('../core/global.config')

// 创建服务
request.post('/service/create').proxy()

// 初始化服务
request
  .post('/service/initialize')
  .data((req) => {
    const dir = req.body.dir
    cache.set('SERVICE_ROOT', dir)
    globalConfig.build(req.body)
  })

// 查询服务信息
request
  .get('/service/profile/:serviceId')
  .data ((req) => {
    const serviceId = req.params.serviceId
    // 读取本地服务配置
    const serviceConfig = cache.services.get(serviceId)
    return axios.get(`/service/profile/${serviceId}`)
      .then(data => {
        return {
          ...,
          local: serviceConfig == null ? null : {
            ...serviceConfig
          }
        }
      })
      .catch(e => {
        return Promise.reject(e)
      })
  })

module.exports = request.router
