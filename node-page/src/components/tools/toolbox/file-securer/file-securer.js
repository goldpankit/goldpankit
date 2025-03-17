const ALGORITHM = 'AES-GCM'
const KEY_LENGTH = 256
const SALT_LENGTH = 16
const IV_LENGTH = 12

/**
 * 从密码生成加密密钥
 *
 * @param {string} password - 密码
 * @param {Uint8Array} salt - 用于密钥派生的盐值
 * @returns {Promise<CryptoKey>} 派生的密钥
 */
function generateKey(password, salt) {
  return new Promise((resolve, reject) => {
    const encoder = new TextEncoder()
    const passwordBuffer = encoder.encode(password)

    // 从密码生成密钥材料
    crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    )
      .then(keyMaterial => {
        resolve(crypto.subtle.deriveKey(
          {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
          },
          keyMaterial,
          {
            name: ALGORITHM,
            length: KEY_LENGTH
          },
          false,
          ['encrypt', 'decrypt']
        ))
      })
      .catch(e => {
        console.error('生成密钥失败', e)
        reject(e)
      })
  })
}

/**
 * 使用AES-GCM加密文件
 * @param {File} file - 要加密的文件
 * @param {string} password - 加密密码
 * @returns {Promise<{ encryptedData: ArrayBuffer, fileName: string }>}
 */
export function encryptFile(file, password) {
  return new Promise((resolve, reject) => {
    // 生成随机盐值和IV
    const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH))
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH))
    // 生成加密密钥
    generateKey(password, salt)
      .then(async key => {
        // 读取文件内容
        return { key, fileContent: await file.arrayBuffer()}
      })
      .then(async ({ key, fileContent }) => {
        // 加密文件内容
        const encryptedContent = await crypto.subtle.encrypt(
          {
            name: ALGORITHM,
            iv: iv
          },
          key,
          fileContent
        )
        // 组合盐值、IV和加密内容
        const resultBuffer = new Uint8Array(salt.length + iv.length + encryptedContent.byteLength)
        resultBuffer.set(salt, 0)
        resultBuffer.set(iv, salt.length)
        resultBuffer.set(new Uint8Array(encryptedContent), salt.length + iv.length)
        resolve({
          encryptedData: resultBuffer.buffer,
          fileName: `${file.name}.encrypted`
        })
      })
      .catch(e => {
        console.error('加密失败', e)
        reject(e)
      })
  })
}

/**
 * 解密加密文件
 * @param {File} file - 加密的文件
 * @param {string} password - 解密密码
 * @returns {Promise<{ decryptedData: ArrayBuffer, fileName: string }>}
 */
export function decryptFile(file, password) {
  return new Promise((resolve, reject) => {
    // 读取文件内容
    file.arrayBuffer()
      .then(async fileContent => {
        const fileData = new Uint8Array(fileContent)

        // 提取盐值、IV和加密内容
        const salt = fileData.slice(0, SALT_LENGTH)
        const iv = fileData.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH)
        const encryptedContent = fileData.slice(SALT_LENGTH + IV_LENGTH)

        // 生成解密密钥
        return { encryptedContent, key: await generateKey(password, salt), iv}
      })
      .then(({ key, iv, encryptedContent }) => {
        // 解密
        return crypto.subtle.decrypt(
          {
            name: ALGORITHM,
            iv: iv
          },
          key,
          encryptedContent
        )
      })
      .then((decryptedContent) => {
        resolve({
          decryptedData: decryptedContent,
          fileName: file.name.replace('.encrypted', '')
        })
      })
      .catch(e => {
        console.log('解密文件失败', e)
        reject(e)
      })
  })
}

/**
 * 下载处理后的文件
 * @param {ArrayBuffer} data - 要下载的文件数据
 * @param {string} fileName - 下载文件的名称
 */
export function downloadFile(data, fileName) {
  const blob = new Blob([data])
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
