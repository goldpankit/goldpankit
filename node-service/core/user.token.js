const cache = require('./utils/cache')
module.exports = {
  // 创建
  create (token) {
    cache.tokens.save({
      value: token,
      storageTime: new Date().getTime()
    })
  },
  // 获取
  getToken () {
    const tokens = cache.tokens.getAll().sort((item1, item2) => {
      return item1.storageTime - item2.storageTime
    })
    return tokens[0]
  },
  // 清空
  clear () {
    cache.tokens.clear()
  }
}
