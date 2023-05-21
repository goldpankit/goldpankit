const request = require('../utils/request.define')
const axios = require('../utils/request.axios')
const cache = require('../core/utils/cache')
const service = require('../core/service')

// 创建服务
request.post('/service/create').proxy()

// 搜索服务
request.post('/service/search').proxy()

// 获取服务配置
request
  .get('/service/:serviceId/config')
  .data(req => {
    return service.getServiceConfig(req.params.serviceId)
  })

// 推送服务
request
  .get('/service/:serviceId/push')
  .data(req => {
    return service.push(req.params.serviceId)
  })

// 初始化服务
request
  .post('/service/initialize')
  .data((req) => {
    service.initialize(req.body)
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
          ...data,
          local: serviceConfig == null ? null : {
            ...serviceConfig
          }
        }
      })
      .catch(e => {
        return Promise.reject(e)
      })
  })

// 查询服务文件
request
  .get('/service/:serviceId/files')
  .data ((req) => {
    return service.getFileTree(req.params.serviceId)
  })

// 保存文件配置
request
  .post('/service/file/setting/save')
  .data(req => {
    service.saveFileSetting(req.body)
  })

// 保存服务变量
request
  .post('/service/variables/save')
  .data(req => {
    service.saveVariables(req.body)
  })

module.exports = request.router
