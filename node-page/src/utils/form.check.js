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

/**
 * 验证邮箱
 */
export function checkEmail (rule, value, callback, message) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    callback(new Error(message))
    return
  }
  callback()
}

/**
 * 验证手机号
 */
export function checkMobile (rule, value, callback, message) {
  if (!/^1[3456789]\d{9}$/.test(value)) {
    callback(new Error(message))
    return
  }
  callback()
}

// 验证版本号
export function checkVersionNumber (rule, value, callback, message) {
  if (!/^(?!0)(\d+)\.(\d+)\.(\d+)/.test(value)) {
    callback(new Error(message))
    return
  }
  callback()
}

export function checkVariable () {}
