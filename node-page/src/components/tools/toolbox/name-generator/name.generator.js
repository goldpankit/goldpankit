export default {
  _split(input) {
    if (typeof input !== "string") {
      throw new Error(`Invalid input type=${typeof input}`);
    }
    return input
      .replace(/[\s_-]+/g, "|")
      .replace(/([a-z])([A-Z])/g, "$1|$2")
      .trim()
      .split("|")
      .filter((word) => word)
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
   * 帕斯卡命名转换
   *
   * @param {string} input 待转换的字符串，支持驼峰、下划线、中划线、空格分隔符
   * @returns {string} 转换后的字符串
   */
  toPascalCase(input) {
    const variableName = this._split(input);
    const words = variableName.split("|");
    return words
      .map((word) => {
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
  toSnakeCase(input, dimension ) {
    const variableName = this._split(input);
    const words = variableName.split("|");
    const snakeCase = words.join("_");
    if (dimension === undefined) {
      return snakeCase
    }
    return dimension ? snakeCase.toUpperCase() : snakeCase.toLowerCase();
  },

  /**
   * 中划线命名转换
   *
   * @param {string} input 待转换的字符串，支持驼峰、下划线、中划线、空格分隔符
   * @param {boolean} dimension 下划线风格，小写 false，大写 true
   * @returns {string} 转换后的字符串
   */
  toKebabCase(input, dimension ) {
    const variableName = this._split(input);
    const words = variableName.split("|");
    const kebabCase = words.join("-");
    if (dimension === undefined) {
      return kebabCase
    }
    return dimension ? kebabCase.toUpperCase() : kebabCase.toLowerCase();
  },

  /**
   * 全小写
   *
   * @param {string} input 待转换的字符串，支持驼峰、下划线、中划线、空格分隔符
   * @returns {string} 转换后的字符串
   */
  toLowerCase(input) {
    const variableName = this._split(input);
    const words = variableName.split("|");
    return words.map(item => item.toLowerCase()).join(' ')
  },

  /**
   * 全大写
   *
   * @param {string} input 待转换的字符串，支持驼峰、下划线、中划线、空格分隔符
   * @returns {string} 转换后的字符串
   */
  toUpperCase(input) {
    const variableName = this._split(input);
    const words = variableName.split("|");
    return words.map(item => item.toUpperCase()).join(' ')
  }
};
