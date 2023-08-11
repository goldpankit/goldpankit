const request = require('../utils/request.define')
const fs = require('../core/utils/fs')
const path = require('path')

// 获取运行时根目录
request
  .get('/local/file/runtime/root')
  .data(() => {
    return fs.getRuntimeRoot()
  })

// 获取本地文件列表
request
  .get('/local/file/list')
  .data((req) => {
    return fs.getFiles(req.query.target).map(item => {
      let type = 'UNKNOWN'
      try {
        type = fs.isDirectory(path.join(req.query.target, item)) ? 'DIRECTORY' : 'FILE'
      } catch (e) {
        console.log('e')
      }
      return {
        path: item,
        type
      }
    })
  })

// 创建本地目录
request
  .get('/local/directory/create')
  .data((req) => {
    fs.createDirectory(req.query.path)
  })

module.exports = request.router
