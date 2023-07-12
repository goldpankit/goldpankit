const service = require('./service')
const serviceSpace = require('./service.space')
const serviceCompile = require('./service.compile')
const serviceVersion = require('./service.version')
const userProject = require('./user.project')
const userRegis = require('./user.regis')
const userLogin = require('./user.login')
const localFile = require('./local.file')
const db = require('./db')
module.exports = {
  service, serviceSpace, serviceCompile, serviceVersion, userProject, userRegis, userLogin, localFile, db
};
