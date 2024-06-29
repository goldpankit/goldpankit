const colors = require('colors-console')
const env = require('../../env').getConfig()

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
    if (env.debug) {
      console.log(this.__prefix(), colors('grey', `[DEBUG] ${message}`))
    }
  },
  // 提示消息
  tip (message) {
    console.log(this.__prefix(), colors('cyan', message))
  },
  // 警告
  warn (message) {
    console.log(this.__prefix(), colors('yellow', '[WARN]'), message)
  },
  // 错误消息
  error (message, e) {
    try {
      // 字符串
      if (typeof message === 'string') {
        if (e == null) {
          console.log(this.__prefix(), colors('red', '[ERR]'), message)
        } else {
          console.log(this.__prefix(), colors('red', '[ERR]'), message, e)
        }
        return
      }
      // 异常对象
      if (message instanceof Error) {
        console.log(this.__prefix(), colors('red', '[ERR]'), message)
        return
      }
      // 接口响应
      if (message.code != null) {
        console.log(this.__prefix(), colors('red', '[ERR]'), `${message.code}: ${message.message}`)
        return
      }
      // 其它
      console.log(this.__prefix(), colors('red', '[ERR]'), message)
    } catch (e) {
      console.error('输出错误消息出现了异常', e)
    }
  },
  // 成功消息
  success (message) {
    console.log(this.__prefix(), colors('green', '[SUCCESS]'), message)
  },
  // 日志前缀
  __prefix () {
    return colors('grey', getTimestamp()) + colors('cyan', ' [gold pan kit] ')
  }
}
