const CACHE = {}

module.exports = {
  set (key, value) {
    CACHE[key] = value
  },
  get (key) {
    return CACHE[key]
  }
}
