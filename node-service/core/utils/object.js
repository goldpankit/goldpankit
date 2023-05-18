module.exports = {
  // 合并对象
  merge (source, target) {
    for (const key in target) {
      target[key] = source[key] || target[key]
    }
  }
}
