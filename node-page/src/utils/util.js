/**
 * 为对象、数组、字符串等数据去空
 *
 * @param data 数据
 * @returns {string|null|*}
 */
export function trim (data) {
  if (data == null) {
    return null
  }
  if (typeof data === 'string') {
    return data.trim()
  }
  if (data instanceof Array) {
    for (const item of data) {
      trim(item)
    }
  }
  if (typeof data === 'object') {
    for (const key in data) {
      data[key] = trim(data[key])
    }
  }
  return data
}

/**
 * 获取限制字符串
 * @param string 字符串
 * @param limit 限制数
 */
// 获取省略字符串
export function getLimitString (string, limit = 15) {
  const letters = Array.from(string)
  if (letters.length > limit) {
    return letters.slice(0, limit).join('') + '...'
  }
  return string
}
