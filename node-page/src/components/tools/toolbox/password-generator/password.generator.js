export default {
  /**
   * 密码生成器
   *
   * 复杂度选项：
   * - lowercase：包含小写字母
   * - uppercase：包含大写字母
   * - numbers：包含数字
   * - special：包含特殊字符
   *
   * @param {number} length 密码长度
   * @param {*} options 密码复杂度选项
   * @returns {string} 生成的密码
   */
  generatePassword(length, options) {
    const toolFunName = "密码生成器";
    length = Number(length);
    if (isNaN(length) || length <= 0) {
      throw new Error(
        `[${toolFunName}] Password length must be a positive number.`
      );
    }
    if (!Array.isArray(options) || options.length === 0) {
      throw new Error(`[${toolFunName}] Options must be a non-empty array.`);
    }

    const validOptions = ["lowercase", "uppercase", "numbers", "special"];
    for (const option of options) {
      if (!validOptions.includes(option)) {
        throw new Error(
          `[${toolFunName}] Invalid option: ${option}. Valid options are ${validOptions.join(
            ", "
          )}.`
        );
      }
    }

    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const specialCharacters = "!@#$%^&*()_+[]{}|;:,.<>?";

    let characterPool = "";
    if (options.includes("lowercase")) characterPool += lowercase;
    if (options.includes("uppercase")) characterPool += uppercase;
    if (options.includes("numbers")) characterPool += numbers;
    if (options.includes("special")) characterPool += specialCharacters;

    if (characterPool.length === 0) return "";

    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characterPool.length);
      password += characterPool[randomIndex];
    }

    return password;
  },
};
