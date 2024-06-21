const utils = require('./utils/index')
const fs = require('./utils/fs')
const cache = require('./utils/cache')
const path = require('path')
const Const = require('./constants/constants')
module.exports = {
  /**
   * 创建
   * @param database = {
   *   projectId: '项目ID',
   *   name: '数据库昵称',
   *   type: '类型',
   *   host: '',
   *   port: '',
   *   username: '',
   *   password: '',
   *   schema: '库名',
   *   models: [扩展模型]
   * }
   *
   * @returns {Promise<never>|Promise<unknown>}
   */
  create (database) {
    const projectId = database.projectId
    // 分配ID
    database.id = utils.generateId()
    // 移除projectId
    delete database.projectId
    // 保存
    const databases = this.getProjectDatabaseConfigByIdWithDefaultBlankArray(projectId)
    databases.push(database)
    fs.rewrite(this.getDatabaseConfigPath(projectId), fs.toJSONFileString(databases))
    return Promise.resolve(database.id)
  },
  // 修改
  updateById (newDatabase) {
    // 验证数据
    const databases = this.getProjectDatabaseConfigByIdWithDefaultBlankArray(newDatabase.projectId)
    const target = databases.find(db => db.id === newDatabase.id)
    if (target == null) {
      return Promise.reject(new Error('数据库不存在，请刷新后重试！'))
    }
    // 更新数据
    Object.assign(target, newDatabase)
    // 移除projectId
    delete target.projectId
    // 保存
    fs.rewrite(this.getDatabaseConfigPath(database.projectId), fs.toJSONFileString(databases))
  },
  /**
   * 删除
   * @param dto = {
   *   projectId: '项目ID'
   *   databaseId: '数据库ID'
   * }
   */
  deleteById(dto) {
    // 验证数据
    const databases = this.getProjectDatabaseConfigByIdWithDefaultBlankArray(dto.projectId)
    const targetIndex = databases.findIndex(db => db.id === dto.databaseId)
    if (targetIndex === -1) {
      return
    }
    // 执行删除
    databases.splice(targetIndex, 1)
    // 保存
    fs.rewrite(this.getDatabaseConfigPath(dto.projectId), fs.toJSONFileString(databases))
  },
  // 获取项目数据库配置文件路径
  getDatabaseConfigPath (projectId) {
    const project = cache.projects.get(projectId)
    return path.join(project.codespace, Const.PROJECT_DATABASE_CONFIG_FILE)
  },
  // 获取项目数据库配置
  getProjectDatabaseConfigByIdWithDefaultBlankArray (id) {
    const configFilePath = this.getDatabaseConfigPath(id)
    if (!fs.exists(configFilePath)) {
      return []
    }
    return fs.readJSONFile(configFilePath)
  }
}
