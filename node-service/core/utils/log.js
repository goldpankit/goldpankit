const colors = require('colors-console')

function getTimestamp () {
  const date = new Date();
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`
}
module.exports = {
  // 日志消息
  info (message) {
    console.log(colors('grey', `INFO: ${getTimestamp()} `) + colors('cyan', message))
  },
  // DEBUG日志
  debug (message) {
    console.log(colors('grey', `DEBUG: ${getTimestamp()} `) + colors('grey', message))
  },
  // 提示消息
  tip (message) {
    console.log(colors('grey', `TIP: ${getTimestamp()} `) + colors('cyan', message))
  },
  // 警告
  warn (message) {
    console.log(colors('yellow', 'WARN: ' + message))
  },
  // 错误消息
  error (e) {
    // String类型
    if (typeof e === 'string') {
      console.log(colors('red', `ERROR: ${getTimestamp()} ` + e) )
      return
    }
    // 错误对象
    if (e.code == null) {
      console.log(colors('red', e.message), e)
    }
    // 未登录
    if (e.code === '000002') {
      this.warn(`${e.message}，您可以使用coderd login进行登录`);
      return
    }
    console.log(colors('red', 'ERROR: 操作失败！'))
    e.code && console.log(colors('red','错误码: ') + e.code)
    console.log(colors('red','错误详情: ') + e.message)
  },
  // 成功消息
  success (message) {
    console.log(colors('green', `SUCCESS: ${getTimestamp()} ${message}`))
  }
}
