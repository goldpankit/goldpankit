const root = process.cwd()
const open = require('opn')
const net = require('net')
const fs = require('./fs')
const Const = require('../constants/constants')
const cache = require('./cache')
const projectService = require('../project')
module.exports = {
  open (port) {
    const projectConfig = projectService.getProjectConfig(root)
    // 查找是否存在配置文件，如果存在，则自动打开工作提啊
    if (projectConfig != null) {
      // 根据路径查找项目
      const projects = cache.projects.getAll()
      const targetProject = projects.find(p => p.codespace === root)
      if (targetProject != null) {
        open(`http://127.0.0.1:${port}/workbench?project_id=${targetProject.id}`)
        return
      }
      // 根据路径在本地未找到项目，根据kit.json中的项目名称创建一个新项目
      // 如果kit.json中没有项目名称配置，则根据项目的最后一个目录名称来创建项目
      let projectName = projectConfig.name == null ? null : projectConfig.name.trim()
      if (projectName == null) {
        projectName = fs.getFilename(root)
      }
      projectService.create({
        name: projectName,
        codespace: root,
        remark: ''
      })
        .then(projectId => {
          open(`http://127.0.0.1:${port}/workbench?project_id=${projectId}`)
        })
      return
    }
    // 找不到配置文件或项目，则打开公共空间页面
    open(`http://127.0.0.1:${port}`)
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
