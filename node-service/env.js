const config = {
  current: 'develop',
  common: {
    localApiPrefix: '/local-api',
    remoteApiPrefix: "/remote-api",
    limitFiles: 5000
  },
  develop: {
    remoteApi: "http://localhost:10088"
  },
  production: {
    remoteApi: "http://client-api.goldpankit.com"
  }
}
module.exports = {
  getConfig () {
    const conf = {}
    Object.assign(conf, config.common, config[config.current])
    conf.env = config.current
    return conf
  }
}
