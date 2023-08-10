const colors = require('colors-console')

function getTimestamp () {
  const date = new Date();
  return `${date.getFullYear()-2000}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}
module.exports = {
  // 日志消息
  info (message) {
    console.log(this.__prefix(), colors('cyan', message))
  },
  // DEBUG日志
  debug (message) {
    console.log(this.__prefix(), colors('grey', message))
  },
  // 提示消息
  tip (message) {
    console.log(this.__prefix(), colors('cyan', message))
  },
  // 警告
  warn (message) {
    console.log(this.__prefix(), colors('yellow', 'WARN: ' + message))
  },
  // 错误消息
  error (e) {
    // 字符串
    if (typeof e === 'string') {
      console.log(this.__prefix(), colors('red', 'ERR: ' + e) )
      return
    }
    // 异常对象
    if (e.code == null) {
      console.log(this.__prefix(), colors('red', e.message), e)
    }
  },
  // 成功消息
  success (message) {
    console.log(this.__prefix(), colors('green', message))
  },
  // 日志前缀
  __prefix () {
    return colors('grey', getTimestamp()) + colors('cyan', ' [gold pan kit] ')
  }
}
