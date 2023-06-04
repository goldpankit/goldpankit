module.exports = {
  // 合并对象
  merge (source, target, only=[]) {
    for (const key in source) {
      if (target[key] === undefined) {
        continue
      }
      if (only.length > 0) {
        if (only.find(field => field === key) == null) {
          continue
        }
      }
      target[key] = source[key] == null ? target[key] : source[key]
    }
    return this
  }
}
