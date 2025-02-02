const Const = require('../constants/constants')
const fs = require("./fs");
const path = require('path')
const CACHE = {}

class Cache {
  cacheKey;
  defaultValue;
  constructor(cacheKey, defaultValue) {
    this.cacheKey = cacheKey
    this.defaultValue = defaultValue
  }
  // 保存数据
  set (data) {
    const config = this.read()
    config[this.cacheKey] = data
    this.rewrite(config)
  }
  get () {
    const config = this.read()
    if (config[this.cacheKey] == null) {
      return this.defaultValue
    }
    return config[this.cacheKey]
  }
  // 检查配置文件
  checkFile () {
    // 验证配置目录是否存在，不存在则创建
    const configDirectory = this.getConfigDirectory()
    if (!fs.exists(configDirectory)) {
      fs.createDirectory(configDirectory, true)
    }
    // 验证配置文件是否存在，不存在则创建
    const configFilePath = this.getConfigFile()
    if (!fs.exists(configFilePath)) {
      const content = JSON.stringify(Const.LOCAL_CONFIG_FILE_CONTENT, null, 2)
      fs.createFile(configFilePath, content, true)
    }
    // 存在则同步配置结构
    else {
      const defaultConfig = JSON.parse(JSON.stringify(Const.LOCAL_CONFIG_FILE_CONTENT))
      const config = this.read()
      Object.assign(defaultConfig, config)
      fs.createFile(this.getConfigFile(), fs.toJSONFileString(defaultConfig), true)
    }
  }
  // 读取配置文件
  read () {
    return fs.readJSONFile(this.getConfigFile())
  }
  // 重写配置
  rewrite (config) {
    fs.createFile(this.getConfigFile(), fs.toJSONFileString(config), true)
  }
  // 获取配置目录
  getConfigDirectory () {
    // HOME为linux系统用户目录，USERPROFILE为windows系统用户目录
    const home = process.env.HOME||process.env.USERPROFILE
    return path.join(home, Const.LOCAL_CONFIG_DIRECTORY)
  }
  // 获取配置文件路径
  getConfigFile () {
    return path.join(this.getConfigDirectory(), Const.LOCAL_CONFIG_FILE)
  }
}

class ArrayCache extends Cache{
  #uniqueField
  constructor(cacheKey, uniqueField) {
    super(cacheKey, [])
    this.#uniqueField = uniqueField
    this.checkFile()
  }
  // 保存
  save (data) {
    const config = this.read()
    const list = config[this.cacheKey]
    // 获取目标数据
    const queryArgs = []
    if (typeof this.#uniqueField === 'string') {
      queryArgs.push(data[this.#uniqueField])
    }
    if (this.#uniqueField instanceof Array) {
      for (const uniqueField of this.#uniqueField) {
        queryArgs.push(data[uniqueField])
      }
    }
    const targetIndex = this.getIndex.apply(this, queryArgs)
    // 修改
    if (targetIndex !== -1) {
      Object.assign(list[targetIndex], data)
    }
    // 添加
    else {
      list.push(data)
    }
    this.rewrite(config)
  }
  // 获取数据
  get () {
    const config = this.read()
    return config[this.cacheKey][this.getIndex.apply(this, [...arguments])]
  }
  // 获取所有数据
  getAll () {
    return this.read()[this.cacheKey]
  }
  // 获取坐标
  getIndex() {
    const config = this.read()
    const list = config[this.cacheKey]
    // 如果cacheKey为字符串，则根据单key来处理
    if (typeof this.#uniqueField === 'string') {
      const unique = arguments[0]
      return list.findIndex(item => item[this.#uniqueField] === unique)
    }
    // 如果cacheKey为数组，则根据多key来处理
    if (this.#uniqueField instanceof Array) {
      const uniqueValues = [...arguments].join('-')
      return list.findIndex(item => {
        const itemUniqueValues = []
        for (const uniqueField of this.#uniqueField) {
          itemUniqueValues.push(item[uniqueField])
        }
        return itemUniqueValues.join('-') === uniqueValues
      })
    }
    return -1
  }
  // 搜索
  search (pageWrap = null) {
    const config = this.read()
    const datalist = config[this.cacheKey].reverse()
    if (pageWrap != null && JSON.stringify(pageWrap) !== '{}') {
      const startIndex = (pageWrap.pageIndex - 1) * pageWrap.capacity
      const endIndex = startIndex + pageWrap.capacity
      return {
        total: datalist.length,
        records: datalist.splice(startIndex, endIndex)
      }
    }
    return datalist
  }
  // 删除
  remove () {
    const config = this.read()
    const list = config[this.cacheKey]
    const uniqueValue = [...arguments].join('-')
    let index = -1;
    if (typeof this.#uniqueField === 'string') {
      index = list.findIndex(item => item[this.#uniqueField] === uniqueValue)
    }
    if (this.#uniqueField instanceof Array) {
      index = list.findIndex(item => {
        const itemUniqueValues = []
        for (const uniqueField of this.#uniqueField) {
          itemUniqueValues.push(item[uniqueField])
        }
        return itemUniqueValues.join('-') === uniqueValue
      })
    }

    if (index === -1) {
      return
    }
    list.splice(index, 1)
    this.rewrite(config)
  }
  clear () {
    const config = this.read()
    config[this.cacheKey] = []
    this.rewrite(config)
  }
}

module.exports = {
  set (key, value) {
    CACHE[key] = value
  },
  get (key) {
    return CACHE[key]
  },
  remove (key) {
    delete CACHE[key]
  },
  // 当前语言
  lang: new Cache('lang', 'en'),
  // 登录令牌
  tokens: new ArrayCache('tokens', ['value']),
  // 服务
  services: new ArrayCache('services', ['space', 'name']),
  // 插件
  plugins: new ArrayCache('plugins', ['space', 'service', 'name']),
  // 项目
  projects: new ArrayCache('projects', 'id')
}
