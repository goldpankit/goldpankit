export default {
  _split(input) {
    const toolFunName = "名称转换";
    if (typeof input !== "string") {
      throw new Error(`[${toolFunName}] Invalid input type=${typeof input}`);
    }
    return input
      .replace(/[\s_-]+/g, "|")
      .replace(/([a-z])([A-Z])/g, "$1|$2")
      .trim()
      .split("|")
      .filter((word) => word)
      .map((word) => {
        return word.toLowerCase();
      })
      .join("|");
  },

  /**
   * 驼峰命名转换
   *
   * @param {string} input 待转换的字符串，支持驼峰、下划线、中划线、空格分隔符
   * @param {boolean} dimension 驼峰风格，小驼峰 false，大驼峰 true
   * @returns {string} 转换后的字符串
   */
  toCamelCase(input, dimension = false) {
    const variableName = this._split(input);
    const words = variableName.split("|");
    return words
      .map((word, index) => {
        if (index === 0) {
          return dimension
            ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            : word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join("");
  },

  /**
   *下划线命名转换
   *
   * @param {string} input 待转换的字符串，支持驼峰、下划线、中划线、空格分隔符
   * @param {boolean} dimension 下划线风格，小写 false，大写 true
   * @returns {string} 转换后的字符串
   */
  toSnakeCase(input, dimension = false) {
    const variableName = this._split(input);
    const words = variableName.split("|");
    const snakeCase = words.join("_");
    return dimension ? snakeCase.toUpperCase() : snakeCase.toLowerCase();
  },

  /**
   * 中划线命名转换
   *
   * @param {string} input 待转换的字符串，支持驼峰、下划线、中划线、空格分隔符
   * @param {boolean} dimension 下划线风格，小写 false，大写 true
   * @returns {string} 转换后的字符串
   */
  toKebabCase(input, dimension = false) {
    const variableName = this._split(input);
    const words = variableName.split("|");
    const kebabCase = words.join("-");
    return dimension ? kebabCase.toUpperCase() : kebabCase.toLowerCase();
  },
};
