import CryptoJS from "crypto-js";
import { padEnd } from "lodash";

export default class CryptoHelper {
  constructor() {
    this.modeMap = {
      ECB: CryptoJS.mode.ECB,
      CBC: CryptoJS.mode.CBC,
      CTR: CryptoJS.mode.CTR,
      OFB: CryptoJS.mode.OFB,
      CFB: CryptoJS.mode.CFB,
    };

    this.modeLists = Object.keys(this.modeMap);

    this.paddingMap = {
      Pkcs7: CryptoJS.pad.Pkcs7,
      Iso97971: CryptoJS.pad.Iso97971,
      AnsiX923: CryptoJS.pad.AnsiX923,
      Iso10126: CryptoJS.pad.Iso10126,
      ZeroPadding: CryptoJS.pad.ZeroPadding,
      NoPadding: CryptoJS.pad.NoPadding,
    };

    this.paddingLists = Object.keys(this.paddingMap);

    this.keySizeMap = {
      "128": 128,
      "192": 192,
      "256": 256,
    };

    this.keySizeLists = Object.keys(this.keySizeMap);
  }

  /**
   * 处理密钥或向量（IV）的工具函数
   */
  secretHandle(name, secret = "", length = 0, fill = true) {
    if (!fill && secret.length === 0) {
      throw new Error(`[${name}] 不能为空`);
    }
    if (length === 0 || secret.length === length) {
      return CryptoJS.enc.Utf8.parse(secret);
    }

    if (secret.length > length) {
      return CryptoJS.enc.Utf8.parse(secret.substring(0, length));
    }

    if (!fill) {
      throw new Error(`[${name}] 长度不等于 ${length}`);
    }

    return CryptoJS.enc.Utf8.parse(padEnd(secret, length, "\0"));
  }

  /**
   * AES 加密函数
   */
  aesEncrypt(input, options) {
    const { key, iv = "", mode = "CBC", key_size = "128", padding = "Pkcs7", type = "simple", fill = true } = options;
    if (type === "simple") {
      return CryptoJS.AES.encrypt(CryptoJS.enc.Base64.parse(input), key).toString();
    }
    return CryptoJS.AES.encrypt(
      CryptoJS.enc.Base64.parse(input),
      this.secretHandle("key", key, this.keySizeMap[key_size] / 8),
      {
        mode: this.modeMap[mode],
        padding: this.paddingMap[padding],
        ...(mode === "ECB" ? {} : { iv: this.secretHandle("iv", iv, 16, fill) }),
      }
    ).toString();
  }

  /**
   * AES 解密函数
   */
  aesDecrypt(input, options) {
    const { key, iv = "", mode = "CBC", key_size = "128", padding = "Pkcs7", type = "simple", fill = true } = options;
    if (type === "simple") {
      return CryptoJS.AES.decrypt(input, key).toString(CryptoJS.enc.Base64);
    }
    return CryptoJS.AES.decrypt(input, this.secretHandle("key", key, this.keySizeMap[key_size] / 8), {
      mode: this.modeMap[mode],
      padding: this.paddingMap[padding],
      ...(mode === "ECB" ? {} : { iv: this.secretHandle("iv", iv, 16, fill) }),
    }).toString(CryptoJS.enc.Base64);
  }

  /**
   * DES 加密函数
   */
  desEncrypt(input, options) {
    const { key, iv = "", mode = "CBC", padding = "Pkcs7", type = "simple", fill = true } = options;
    if (type === "simple") {
      return CryptoJS.DES.encrypt(CryptoJS.enc.Base64.parse(input), key).toString();
    }
    return CryptoJS.DES.encrypt(CryptoJS.enc.Base64.parse(input), this.secretHandle("key", key, 8), {
      mode: this.modeMap[mode],
      padding: this.paddingMap[padding],
      ...(mode === "ECB" ? {} : { iv: this.secretHandle("iv", iv, 8, fill) }),
    }).toString();
  }

  /**
   * DES 解密函数
   */
  desDecrypt(input, options) {
    const { key, iv = "", mode = "CBC", padding = "Pkcs7", type = "simple", fill = true } = options;
    if (type === "simple") {
      return CryptoJS.DES.decrypt(input, key).toString(CryptoJS.enc.Base64);
    }
    return CryptoJS.DES.decrypt(input, this.secretHandle("key", key, 8), {
      mode: this.modeMap[mode],
      padding: this.paddingMap[padding],
      ...(mode === "ECB" ? {} : { iv: this.secretHandle("iv", iv, 8, fill) }),
    }).toString(CryptoJS.enc.Base64);
  }

  /**
   * TripleDES 加密函数
   */
  tripleDesEncrypt(input, options) {
    const { key, iv = "", mode = "CBC", padding = "Pkcs7", type = "simple", fill = true } = options;
    if (type === "simple") {
      return CryptoJS.TripleDES.encrypt(CryptoJS.enc.Base64.parse(input), key).toString();
    }
    return CryptoJS.TripleDES.encrypt(CryptoJS.enc.Base64.parse(input), this.secretHandle("key", key, 24), {
      mode: this.modeMap[mode],
      padding: this.paddingMap[padding],
      ...(mode === "ECB" ? {} : { iv: this.secretHandle("iv", iv, 8, fill) }),
    }).toString();
  }

  /**
   * TripleDES 解密函数
   */
  tripleDesDecrypt(input, options) {
    const { key, iv = "", mode = "CBC", padding = "Pkcs7", type = "simple", fill = true } = options;
    if (type === "simple") {
      return CryptoJS.TripleDES.decrypt(input, key).toString(CryptoJS.enc.Base64);
    }
    return CryptoJS.TripleDES.decrypt(input, this.secretHandle("key", key, 24), {
      mode: this.modeMap[mode],
      padding: this.paddingMap[padding],
      ...(mode === "ECB" ? {} : { iv: this.secretHandle("iv", iv, 8, fill) }),
    }).toString(CryptoJS.enc.Base64);
  }
}
