const BASE62_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export default class BinaryConversion {
  /**
   * 将一个数从任意进制 (2-62) 转换为另一个任意进制 (2-62)
   * @param {string} value - 要转换的数字
   * @param {number} fromBase - 输入数字的进制 (2 到 62 之间)
   * @param {number} toBase - 要转换的目标进制 (2 到 62 之间)
   * @returns {string} - 转换后的数字，作为目标进制的字符串返回
   */
  convertBase(value, fromBase, toBase) {
    // 验证进制是否合法
    if (fromBase < 2 || fromBase > 62 || toBase < 2 || toBase > 62) {
      throw new Error('进制必须在 2 到 62 之间');
    }

    // 将输入数字从指定进制转换为十进制
    const decimalValue = this.baseToDecimal(value, fromBase);

    // 将十进制数转换为目标进制
    return this.decimalToBase(decimalValue, toBase);
  }

  /**
   * 将指定进制的数字转换为十进制 (10进制)
   * @param {string} value - 指定进制的数字
   * @param {number} base - 输入数字的进制 2 到 62 之间
   * @returns {number} - 输入数字的十进制表示
   */
  baseToDecimal(value, base) {
    let decimalValue = 0;
    for (let i = 0; i < value.length; i++) {
      const digit = BASE62_CHARS.indexOf(value[i]);
      if (digit === -1 || digit >= base) {
        throw new Error(`字符 "${value[i]}" 对于进制 ${base} 是无效的`);
      }
      decimalValue = decimalValue * base + digit;
    }
    return decimalValue;
  }

  /**
   * 将十进制数字 (10进制) 转换为指定进制 (2-62)
   * @param {number} decimalValue - 要转换的十进制数字
   * @param {number} base - 目标进制 2 到 62 之间
   * @returns {string} - 目标进制的数字, 作为字符串返回
   */
  decimalToBase(decimalValue, base) {
    if (decimalValue === 0) return '0';

    let result = '';
    while (decimalValue > 0) {
      const remainder = decimalValue % base;
      result = BASE62_CHARS[remainder] + result;
      decimalValue = Math.floor(decimalValue / base);
    }
    return result;
  }
}
