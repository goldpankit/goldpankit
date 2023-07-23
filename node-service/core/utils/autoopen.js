const root = process.cwd()
const open = require('opn')
const net = require('net')
const fs = require('./fs')
const Const = require('../constants/constants')
const cache = require('./cache')
module.exports = {
  open (port) {
    const files = fs.getFiles(root)
    // 查找是否存在配置文件，如果存在，则自动打开workbench
    if (files.find(f => f === Const.SERVICE_CONFIG_FILE) != null) {
      const projects = cache.projects.getAll()
      const targetProject = projects.find(p => p.codespace === root)
      if (targetProject != null) {
        open(`http://localhost:${port}/workbench?project_id=${targetProject.id}`)
        return
      }
    }
    // 找不到配置文件或项目，则打开公共空间页面
    open(`http://localhost:${port}/spaces`)
  },
  // 查询可用的端口号
  findAvailablePort(port, callback) {
    const server = net.createServer();
    server.once('error', () => {
      // 端口被占用，则尝试监听下一个端口
      this.findAvailablePort(port + 1, callback);
    });
    server.once('listening', () => {
      // 端口未被占用，则关闭服务器并返回端口号
      server.close(() => {
        callback(port);
      });
    });
    server.listen(port);
  }
}
