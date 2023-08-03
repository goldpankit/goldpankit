/**
 * 验证表名
 */
export function checkTableName (rule, value, callback, message) {
  if (!/^[a-zA-Z][a-zA-Z0-9_]+$/.test(value)) {
    callback(new Error(message))
    return
  }
  callback()
}

export function checkVariable () {}
