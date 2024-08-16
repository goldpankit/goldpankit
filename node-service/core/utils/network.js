const networkAddress = require('network-address');
module.exports = {
  // 获取局域网地址
  getNetworkAddress: function () {
    return networkAddress()
  }
}
