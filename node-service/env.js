const config = {
  current: 'production',
  common: {
    debug: false,
    localApiPrefix: '/local-api',
    remoteApiPrefix: "/remote-api",
    limitFiles: 5000
  },
  develop: {
    remoteApi: "http://localhost:10088"
  },
  production: {
    remoteApi: "http://112.74.58.58"
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
