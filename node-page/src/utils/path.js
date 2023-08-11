export default {
  // 合并路径
  join (paths) {
    const os = this.getOS()
    if (os === 'windows') {
      return `${paths.join('\\')}\\`
    }
    return `/${paths.join('/')}`
  },
  // 分割
  split (path){
    const os = this.getOS()
    if (os === 'windows') {
      return path.split('\\')
    }
    return path.split('/')
  },
  // 获取操作系统
  getOS () {
    const platform = navigator.platform;
    if (platform.indexOf('Win') !== -1) {
      return 'windows'
    } else if (platform.indexOf('Mac') !== -1) {
      return 'macOS'
    } else if (platform.indexOf('Linux') !== -1) {
      return 'linux'
    } else if (platform.indexOf('iPhone') !== -1 || platform.indexOf('iPad') !== -1) {
      return 'iOS'
    } else if (platform.indexOf('Android') !== -1) {
      return 'android'
    } else {
      return 'unknown'
    }
  }
}
