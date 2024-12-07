import CryptoJS from "crypto-js";

export class Encryptor {

  /**
   * MD5 加密
   *
   * @param data - 待加密数据
   * @returns {string} - 密文
   */
  MD5(data) {
    return CryptoJS.MD5(data).toString();
  }

  /**
   * SHA1 加密
   *
   * @param data - 待加密数据
   * @returns {string} - 密文
   */
  SHA1(data) {
    return CryptoJS.SHA1(data).toString()
  }

  /**
   * SHA256 加密
   *
   * @param data - 待加密数据
   * @returns {string} - 密文
   */
  SHA256(data) {
    return CryptoJS.SHA256(data).toString()
  }

  /**
   * SHA512 加密
   *
   * @param data - 待加密数据
   * @returns {string} - 密文
   */
  SHA512(data) {
    return CryptoJS.SHA512(data).toString()
  }

  /**
   * 使用 Base64 加密字符串
   *
   * @param {string} data - 需要加密的原始字符串
   * @returns {string} - 返回 Base64 编码后的字符串
   */
  base64Encrypt(data) {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data));
  }

  /**
   * 解密 Base64 编码的字符串
   *
   * @param {string} cipher - Base64 编码的字符串
   * @returns {string} - 返回解密后的原始字符串
   */
  base64Decrypt(cipher) {
    return CryptoJS.enc.Base64.parse(cipher).toString(CryptoJS.enc.Utf8);
  }

  /**
   * 对 URI 组件进行 URL 编码
   *
   * 将给定的字符串中的特殊字符（如空格、&、?、= 等）进行百分号编码（percent-encoded）。
   * 适用于编码 URL 查询参数或 URL 片段。
   *
   * @param {string} url - 需要进行编码的字符串
   * @returns {string} - 编码后的字符串，适合安全地用于 URL 中
   */
  urlEncode(url) {
    return encodeURIComponent(url);
  };

  /**
   * 对 URI 组件进行 URL 解码
   *
   * 将百分号编码的字符串转换为原始字符串。
   * 适用于解码通过 encodeURIComponent 编码的字符串。
   *
   * @param {string} url - 需要解码的百分号编码的字符串
   * @returns {string} - 解码后的原始字符串
   */
  urlDecode(url) {
    return decodeURIComponent(url);
  };

  /**
   * AES加密
   * @param {string} s_text - 等待加密的字符串
   * @param {string} s_key - 16位密钥。用于AES加密的密钥，长度应为16位（128 bits）。该密钥会被UTF-8编码处理。
   * @param {object} [ctx] - 可选参数，AES加密上下文配置对象，包含加密模式和填充方式。
   *   - mode: {object} 加密模式，默认为ECB模式（CryptoJS.mode.ECB），可选模式如CBC等。
   *   - padding: {object} 填充方式，默认为ZeroPadding（CryptoJS.pad.ZeroPadding），可选如PKCS7等。
   * @returns {string} - 返回Base64编码的加密字符串
   */
  aesEncrypt(s_text, s_key, ctx = undefined) {
    if (ctx === undefined) ctx = {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.ZeroPadding};
    const key = CryptoJS.enc.Utf8.parse(s_key);
    const encrypt_data = CryptoJS.AES.encrypt(s_text, key, ctx);
    return encrypt_data.toString();
  }

  /**
   * AES解密
   *
   * @param {string} s_text - 等待解密的字符串
   * @param {string} s_key - 16位密钥。用于AES加密的密钥，长度应为16位（128 bits）。该密钥会被UTF-8编码处理。
   * @param {object} [ctx] - 可选参数，AES加密上下文配置对象，包含加密模式和填充方式。
   *   - mode: {object} 加密模式，默认为ECB模式（CryptoJS.mode.ECB），可选模式如CBC等。
   *   - padding: {object} 填充方式，默认为ZeroPadding（CryptoJS.pad.ZeroPadding），可选如PKCS7等。
   * @returns {string} - 明文字符串
   */
  aesDecrypt(s_text, s_key, ctx = undefined) {
    if (ctx === undefined) ctx = {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.ZeroPadding};
    const key = CryptoJS.enc.Utf8.parse(s_key);
    const decrypt_data = CryptoJS.AES.decrypt(s_text, key, ctx);
    return decrypt_data.toString(CryptoJS.enc.Utf8);
  }
}