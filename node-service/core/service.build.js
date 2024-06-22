const mysql = require('./utils/db/mysql')
const nc = require('./utils/node-command')
const serviceApi = require("./api/service");
const fs = require('./utils/fs')
const log = require('./utils/log')
const path = require('path')
const cache = require('./utils/cache')
const userProjectDatabase = require('./user.project.database')
module.exports = {
  build (dto) {
    const builds = dto.builds
    const project = cache.projects.get(dto.projectId)
    const database = userProjectDatabase.getDatabase(dto.projectId, dto.dataSourceId)
    return new Promise(async (resolve, reject) => {
      if (builds == null || builds.length === 0) {
        resolve()
        return
      }
      try {
        // 获取所有MYSQL脚本，整合在一起执行
        const sqlContent = builds.filter(b => b.type === 'MySQL').map(b => b.content).join('\n')
        if (sqlContent != null && sqlContent !== '') {
          await mysql.exec({
            host: database.host,
            port: database.port,
            user: database.username,
            password: database.password,
            database: database.schema
          }, sqlContent)
        }
        // 获取所有Node脚本，整合在一起执行
        const nodeContent = builds.filter(b => b.type === 'Node').map(b => b.content).join('\n')
        if (nodeContent != null && nodeContent !== '') {
          await nc.exec(project.codespace, nodeContent)
        }
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },
  /**
   * 获取build列表
   * @param operaType 操作类型（INSTALL，UNINSTALL，COMPILE，CLEAN_COMPILE）
   * @param project 项目
   * @param builds 构建列表
   * @param diffFiles 安装&编译/卸载&清除编译的结果文件
   * @param compiler 编译器
   * @param vars 变量
   * @returns {Promise<unknown>}
   */
  getBuildDetails(operaType, project, builds, diffFiles, compiler, vars) {
    return new Promise((resolve, reject) => {
      if (builds.length === 0) {
        resolve(builds)
        return
      }
      // 编译builds
      serviceApi.compileBuilds({
        compiler: compiler,
        variables: vars,
        contents: builds.map(item => item.content)
      })
        .then(contents => {
          const buildDetails = []
          for (let i = 0; i < contents.length; i++) {
            builds[i].content = contents[i]
          }
          for (const build of builds) {
            // 此处content可能是构建脚本内容，也可能是构建脚本文件的路径
            let content = build.content
            if (build.contentType === 'file') {
              // 内容从文件中读取，默认先赋值为null，避免读取不到时构建脚本内容为文件路径
              content = null
              const relativeBuildFilePath = build.content
              const buildFilePath = path.join(project.codespace, relativeBuildFilePath)
              // 编译和安装，从差异文件中读取最新的构建文件，如果找不到，则不做构建处理（说明构建过程没有变化）
              if (operaType === 'INSTALL' || operaType === 'COMPILE') {
                // 从安装或编译的文件中查找最新的构建文件
                if (diffFiles != null && diffFiles.length > 0) {
                  const targetFile = diffFiles.find(file => file.filepath === relativeBuildFilePath.substring(1))
                  if (targetFile != null) {
                    content = targetFile.content
                  }
                }
              }
              // 卸载和清除编译，优先从差异文件中查找文件，如果找不到，则从本地读取
              if (operaType === 'UNINSTALL' || operaType === 'CLEAN_COMPILE') {
                // 从安装或编译的文件中查找最新的构建文件
                if (diffFiles != null && diffFiles.length > 0) {
                  const targetFile = diffFiles.find(file => file.filepath === relativeBuildFilePath.substring(1))
                  if (targetFile != null) {
                    content = targetFile.content
                  }
                }
                // 如果未在差异文件中找到构建内容，则从本地读取
                if (content == null) {
                  if (fs.exists(buildFilePath)){
                    content = fs.readFile(buildFilePath).content
                  }
                }
              }
            }
            if (content != null && content.trim() !== '') {
              buildDetails.push({
                ...build,
                content
              })
            }
          }
          resolve(buildDetails)
        })
        .catch(e => {
          console.log(e)
          reject(e)
        })
    })
  }
}
