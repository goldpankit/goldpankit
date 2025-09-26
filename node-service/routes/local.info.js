const request = require('../utils/request.define')
const os = require('os')
const diskusage = require('diskusage')

// 获取本地信息
request
  .get('/local/info')
  .data(async () => {
    // 本地网络信息
    const interfaces = os.networkInterfaces()
    let ipv4 = '无法获取'
    let ipv6 = '无法获取'
    let mac = '无法获取'
    for (const interface of interfaces.en1) {
      if (interface.family === 'IPv4' && !interface.internal) {
        ipv4 = interface.address
        mac = interface.mac
      }
      if (interface.family === 'IPv6' && !interface.internal) {
        ipv6 = interface.address
      }
    }
    // cpu
    const cpus = os.cpus()
    let diskInfo = { total: 0, free: 0 };
    // 获取磁盘信息
    try {
      diskInfo = diskusage.checkSync('/');
    } catch (error) {
      console.error('获取磁盘信息失败:', error.message);
    }

    return {
      ipv4,
      ipv6,
      mac,
      cpu: `${cpus[0].model}(${os.arch()}) ${cpus.length}核`,
      memory: `${(os.totalmem() / (1024 ** 3)).toFixed(1)}GB`,
      disk: `${(diskInfo.total / (1024 ** 3)).toFixed(1)}GB`,
      os: `${os.type()}`
    }
  })

module.exports = request.router
