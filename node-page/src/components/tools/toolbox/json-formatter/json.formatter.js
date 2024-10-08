/**
 * JSON格式化器
 */
class JsonFormatter {
  /**
   * Json 字符串格式化
   *
   * 带净化功能，会将单引号、中文冒号、中文引号等转换为英文
   *
   * @param {string} jsonText JSON 字符串
   * @param {number} space 缩进空格数
   * @param {boolean} sanitized 是否净化
   * @returns {string}
   */
  format (jsonText, space = 4, sanitized = false) {
    // 参数验证
    if (!jsonText) {
      throw new Error('参数不能为空')
    }
    if (typeof jsonText !== 'string') {
      throw new Error(`jsonText: 错误的参数类型 ${typeof jsonText}`)
    }
    if (typeof space !== 'number' || space < 0) {
      throw new Error(`space: 错误的参数类型 ${typeof space}`)
    }
    // 开启净化
    if (sanitized) {
      jsonText = this.sanitize(jsonText)
    }
    // 格式化
    try {
      return JSON.stringify(JSON.parse(jsonText), null, parseInt(space))
    } catch (error) {
      throw new Error(`格式化失败：${error.message}`)
    }
  }

  /**
   * 净化JSON字符串
   *
   * @param jsonText
   * @returns {*}
   */
  sanitize (jsonText) {
    return jsonText
      .replace(/'/g, '"')
      .replace(/‘/g, '"')
      .replace(/’/g, '"')
      .replace(/“/g, '"')
      .replace(/”/g, '"')
      .replace(/：/g, ":")
      .replace(/True/g, "true")
      .replace(/False/g, "false")
  }
}

export default new JsonFormatter()
