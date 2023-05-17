const Const = require('../constants/constants')
const fs = require("fs");
const CACHE = {}

class ArrayCache {
  #cacheKey
  #uniqueField
  constructor(cacheKey, uniqueField) {
    this.#cacheKey = cacheKey
    this.#uniqueField = uniqueField
    this.#checkFile()
  }
  // 添加
  add (data) {
    const config = this.#read()
    config[this.#cacheKey].push(data)
    this.#rewrite(config)
  }
  // 获取
  get (unique) {
    const config = this.#read()
    const list = config[this.#cacheKey]
    return list.find(item => item[this.#uniqueField] === unique)
  }
  // 删除
  remove (unique) {
    const config = this.#read()
    const list = config[this.#cacheKey]
    const index = list.findIndex(item => item[this.#uniqueField] === unique)
    if (index === -1) {
      return
    }
    list.split(index, 1)
    this.#rewrite(config)
  }
  // 检查配置文件
  #checkFile () {
    // 验证配置目录是否存在，不存在则创建
    const configDirectory = this.#getConfigDirectory()
    if (!fs.existsSync(configDirectory)) {
      fs.mkdirSync(configDirectory, { recursive: true })
    }
    // 验证配置文件是否存在，不存在则创建
    const configFilePath = this.#getConfigFile()
    if (!fs.existsSync(configFilePath)) {
      const content = JSON.stringify(Const.LOCAL_CONFIG_FILE_CONTENT, null, 2)
      fs.writeFileSync(configFilePath, content)
    }
  }
  // 读取配置文件
  #read () {
    return JSON.parse(fs.readFileSync(this.#getConfigFile()).toString())
  }
  // 重写配置
  #rewrite (config) {
    const configFile = this.#getConfigFile()
    fs.unlinkSync(configFile)
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2))
  }
  // 获取配置目录
  #getConfigDirectory () {
    const home = process.env.HOME
    return `${home}/${Const.LOCAL_CONFIG_DIRECTORY}`
  }
  // 获取配置文件路径
  #getConfigFile () {
    return `${this.#getConfigDirectory()}/${Const.LOCAL_CONFIG_FILE}`
  }
}

module.exports = {
  set (key, value) {
    CACHE[key] = value
  },
  get (key) {
    return CACHE[key]
  },
  services: new ArrayCache('services', 'id'),
  projects: new ArrayCache('projects'),
}
