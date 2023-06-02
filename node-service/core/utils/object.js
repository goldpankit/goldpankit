module.exports = {
  // 合并对象
  merge (source, target, only=[]) {
    if (only.length === 0) {
      for (const key in target) {
        target[key] = source[key] || target[key]
      }
      return
    }
    for (const key of only) {
      target[key] = source[key] || target[key]
    }
  }
}
