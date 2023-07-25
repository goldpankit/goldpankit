const mysql = require('./utils/db/mysql')
const nc = require('./utils/node-command')
const serviceApi = require("./api/service");
const fs = require('./utils/fs')
const cache = require('./utils/cache')
module.exports = {
  build (dto) {
    const builds = dto.builds
    const vars = dto.variables
    const compiler = dto.compiler
    const project = cache.projects.get(dto.projectId)
    const database = cache.databases.get(dto.databaseId)
    return new Promise((resolve, reject) => {
      if (builds == null || builds.length === 0) {
        resolve()
        return
      }
      // 编译builds
      serviceApi.compileBuilds({
        compiler: compiler,
        variables: vars,
        contents: builds.map(item => item.content)
      })
        .then(contents => {
          for (let i = 0; i < contents.length; i++) {
            builds[i].content = contents[i]
          }
          Promise.all(builds.map(build => {
            // 执行MySQL脚本
            if (build.type === 'MySQL') {
              return mysql.exec({
                host: database.host,
                port: database.port,
                user: database.username,
                password: database.password,
                database: database.schema
              }, build.content)
            }
            // 执行Node命令
            if (build.type === 'Node') {
              return nc.exec(project.codespace, build.content)
            }
          }))
            .then(() => {
              resolve()
            })
            .catch(e => {
              console.log('build failed', e)
              reject(e)
            })
        })
        .catch(e => {
          console.log('compile builds throw an error', e)
          reject(e)
        })
    })
  },
  // 获取build列表
  getBuildDetails(project, builds) {
    const buildDetails = []
    for (const build of builds) {
      let content = build.content
      if (build.contentType === 'file') {
        content = fs.readFile(`${project.codespace}${build.content}`).content
      }
      buildDetails.push({
        ...build,
        content
      })
    }
    return buildDetails
  }
}
