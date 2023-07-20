const mysql = require('./utils/db/mysql')
const nc = require('./utils/node-command')
const serviceApi = require("./api/service");
module.exports = {
  build (project, database, serviceConfig, vars) {
    if (serviceConfig.builds == null || serviceConfig.builds.length === 0) {
      return
    }
    // 编译builds
    serviceApi.compileBuilds({
      compiler: serviceConfig.compiler,
      variables: vars,
      contents: serviceConfig.builds.map(item => item.content)
    })
      .then(contents => {
        for (let i = 0; i < contents.length; i++) {
          serviceConfig.builds[i].content = contents[i]
        }
        for (const build of serviceConfig.builds) {
          // 执行MySQL脚本
          if (build.type === 'MySQL') {
            let execPromise = null
            if (build.contentType === 'file') {
              execPromise = mysql.execFile({
                host: database.host,
                port: database.port,
                user: database.username,
                password: database.password,
                database: database.schema
              }, `${project.codespace}${build.content}`)
            } else {
              execPromise = mysql.exec({
                host: database.host,
                port: database.port,
                user: database.username,
                password: database.password,
                database: database.schema
              }, build.content)
            }
            execPromise
              .catch(e => {
                console.log('execute mysql script error', e)
              })
            continue
          }
          // 执行Node命令
          if (build.type === 'Node') {
            let ncPromise = null
            if (build.contentType === 'file') {
              ncPromise = nc.execFile(project.codespace, build.content)
            } else {
              ncPromise = nc.exec(project.codespace, build.content)
            }
            ncPromise
              .catch(e => {
                console.log('execute node commands error', e)
              })
          }
        }
      })
      .catch(e => {
        console.log('compile builds throw an error', e)
      })
  }
}
