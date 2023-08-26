var express = require('express');
var router = express.Router();
const request = require('./request.axios')
const cache = require('../core/utils/cache')
const log = require('../core/utils/log')

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
        // 存储请求头到缓存中
        cache.set('request_headers', req.headers)
        cache.set('request_lang', req.headers['x-lang'])
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
        console.error(e)
        res.send(this.#buildError(e));
        throw e
      }
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
    let message = e
    if (typeof e !== 'string') {
      message = e.message
      // 读取i18n消息
      if (message.withI18n === true) {
        message = message[cache.get('request_lang')]
      }
    }
    log.error(message)
    return {
      code: e.code || 500,
      success: false,
      data: null,
      errorData: e.errorData,
      message
    }
  }
}
module.exports = {
  router,
  get (url) {
    // console.log(`[GET] defined api for url '${url}'`)
    return new Request(url, 'get')
  },
  post (url) {
    // console.log(`[POST] defined api for url '${url}'`)
    return new Request(url, 'post')
  }
}
