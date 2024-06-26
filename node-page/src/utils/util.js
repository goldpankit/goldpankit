/**
 * 拷贝数据
 * @param data 待拷贝的数据
 * @param ignores 忽略的字段
 * @returns {any}
 */
export function copyData (data, ignores = []) {
  if (ignores.length === 0) {
    return JSON.parse(JSON.stringify(data))
  }
  const newData = {}
  for (const key in data) {
    if (ignores.includes(key)) {
      continue
    }
    newData[key] = copyData(data[key])
  }
  return JSON.parse(JSON.stringify(newData))
}
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
export function getLimitString (string, limit = 15) {
  const letters = Array.from(string)
  if (letters.length > limit) {
    return letters.slice(0, limit).join('') + '...'
  }
  return string
}

/**
 * 根据字符获取宽度
 * @param string 目标字符串
 * @param extParams 配置
 */
export function getWidthByLetters (string, extParams = {}) {
  const params = {
    // 英文字符占用宽度
    lowerCaseLetterWidth: 10,
    // 英文字符占用宽度
    upperCaseLetterWidth: 10,
    // 中文字符占用宽度
    zhLetterWidth: 16,
    // 数字字符占用宽度
    numberLetterWidth: 8,
    // 最长宽度
    maxWidth: 255
  }
  Object.assign(params, extParams)
  // 统计中英文字符（暂不考虑其他国家，非英即中）
  const letters = Array.from(string)
  let lowerCaseLetterCount = 0
  let upperCaseLetterCount = 0
  let zhLetterCount = 0
  let numberLetterCount = 0
  for (const letter of letters) {
    // 数字字符
    if (/^[0-9]$/.test('' + letter)) {
      numberLetterCount++
    }
    // 小写英文字符
    else if (/^[a-z!"',.:;]+$/.test('' + letter)) {
      lowerCaseLetterCount++
    }
    // 大写英文字符
    else if (/^[A-Z[\]^`|}~{#$%&()@<=>?*_+/-]+$/.test('' + letter)) {
      upperCaseLetterCount++
    }
    // 非英文字符
    else {
      zhLetterCount++
    }
  }
  // 计算并获取最终宽度
  let width = Math.ceil(
    numberLetterCount * params.numberLetterWidth +
    lowerCaseLetterCount * params.lowerCaseLetterWidth +
    upperCaseLetterCount * params.upperCaseLetterWidth +
    zhLetterCount * params.zhLetterWidth
  )
  if (width > params.maxWidth) {
    width = params.maxWidth
  }
  return width
}
