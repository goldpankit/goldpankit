const config = {
  current: 'develop',
  common: {
    debug: true,
    localApiPrefix: '/local-api',
    remoteApiPrefix: "/remote-api",
    limitFiles: 1000
  },
  develop: {
    remoteApi: "http://192.168.124.5:10088"
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
