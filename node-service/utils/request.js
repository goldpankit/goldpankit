var express = require('express');
var router = express.Router();

class Request {
  #url;
  #methods;
  constructor(url, methods) {
    this.#url = url
    this.#methods = methods
  }

  send (callback) {
    let result = callback
    if (typeof callback === 'function') {
      result = callback()
    }
    router[this.#methods](this.#url, function(req, res, next) {
      res.send(result);
    })
    return router
  }
}
module.exports = {
  router,
  get (url) {
    console.log(`defined api for url '${url}'`)
    return new Request(url, 'get')
  },
  post (url) {
    return new Request(url, 'post')
  }
}
