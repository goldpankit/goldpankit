export default {
  /**
   * Json 字符串格式化
   *
   * 带净化功能，会将单引号、中文冒号、中文引号等转换为英文
   *
   * @param {string} jsonText JSON 字符串
   * @param {number} space 缩进空格数
   * @returns {string}
   */
  formatStr(jsonText, space = 4) {
    const toolFunName = "Json 字符串格式化";
    if (!jsonText) throw new Error(`[${toolFunName}] 参数不能为空`);
    if (typeof jsonText !== "string") {
      throw new Error(`[${toolFunName}] 错误的参数类型 ${typeof jsonText}`);
    }

    const sanitizedJson = jsonText
      .replace(/'/g, '"')
      .replace(/‘/g, '"')
      .replace(/’/g, '"')
      .replace(/：/g, ":")
      .replace(/True/g, "true")
      .replace(/False/g, "false");

    try {
      return JSON.stringify(JSON.parse(sanitizedJson), null, space);
    } catch (error) {
      throw new Error(`[${toolFunName}] ${error.message}`);
    }
  },
};
