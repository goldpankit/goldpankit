var express = require('express');
var router = express.Router();
const request = require('./request.axios')

class Request {
  #url;
  #methods;
  constructor(url, methods) {
    this.#url = url
    this.#methods = methods
  }

  // 定义
  data (callback) {
    router[this.#methods](this.#url, (req, res, next) => {
      try {
        let result = callback
        if (typeof callback === 'function') {
          result = callback(req)
        }
        // 结果为Promise
        if (result instanceof Promise) {
          result
            .then(data => {
              res.send(this.#buildSuccess(data));
            })
            .catch(e => {
              res.send(this.#buildError(e))
            })
          return
        }
        // 结果为非Promise
        res.send(this.#buildSuccess(result));
      } catch (e) {
        res.send(this.#buildError(e));
        throw e
      }
    })
  }

  // 代理
  proxy () {
    router[this.#methods](this.#url, (req, res, next) => {
      console.log(`Proxy: ${this.#methods} ${this.#url}`)
      // 如果存在参数
      let url = this.#url
      if (url.indexOf(':') !== -1 && req.params != null && typeof req.params === 'object') {
        for (const key in req.params) {
          url = url.replace(new RegExp(`:${key}`,'g'), req.params[key])
        }
      }
      // 发起请求
      request[this.#methods](url, req.body)
        .then(data => {
          res.send(this.#buildSuccess(data))
        })
        .catch(e => {
          res.send(this.#buildError(e))
        })
    })
  }

  #buildSuccess(data) {
    return {
      code: 200,
      success: true,
      data,
      message: null
    }
  }

  #buildError(e) {
    return {
      code: 500,
      success: false,
      data: null,
      message: e.message
    }
  }
}
module.exports = {
  router,
  get (url) {
    console.log(`[GET] defined api for url '${url}'`)
    return new Request(url, 'get')
  },
  post (url) {
    console.log(`[POST] defined api for url '${url}'`)
    return new Request(url, 'post')
  }
}
