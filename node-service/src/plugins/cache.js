import md5 from 'js-md5'
const buildCacheImpl = impl => {
  return {
    __check () {
      if (!impl) {
        throw new Error('missing cache impl')
      }
    },
    __get (key) {
      this.__check(key)
      if (key == null) {
        return null
      }
      const value = impl.getItem(key)
      if (value == null) {
        return null
      }
      try {
        const valueObj = JSON.parse(value)
        // 已过期处理
        if (valueObj.expiredTime != null && new Date().getTime() > valueObj.expiredTime) {
          this.remove(key)
          return null
        }
        return valueObj
      } catch (e) {
        return { value }
      }
    },
    /**
     * 写入缓存
     *
     * @param key 键
     * @param value 值
     * @param timeout 超时时间，单位毫秒，-1表示不超时
     */
    set (key, value, timeout = -1) {
      if (key == null) {
        return
      }
      if (value == null) {
        return
      }
      let type = typeof value
      if (value instanceof Date) {
        type = 'date'
      }
      let actualValue = value
      if (type === 'object') {
        actualValue = JSON.stringify(value)
      }
      if (type === 'date') {
        actualValue = value.getTime()
      }
      const birthtime = new Date().getTime()
      const valueObj = {
        type,
        value: actualValue,
        birthtime,
        expiredTime: timeout === -1 ? null : birthtime + timeout
      }
      impl.setItem(key, JSON.stringify(valueObj))
    },
    /**
     * 获取缓存值
     *
     * @param key 键
     * @returns {SVGPoint | SVGNumber | string | SVGTransform | SVGLength | SVGPathSeg | T|*|any|{value}|null|any}
     */
    get (key) {
      const valueObj = this.__get(key)
      if (valueObj == null) {
        return null
      }
      if (typeof valueObj !== 'object') {
        return valueObj
      }
      if (valueObj.value == null) {
        return null
      }
      if (valueObj.type === 'date') {
        return new Date(valueObj.value)
      }
      if (valueObj.type === 'object') {
        return JSON.parse(valueObj.value)
      }
      return valueObj.value
    },
    /**
     * 删除缓存值
     *
     * @param key 键
     */
    remove (key) {
      impl.removeItem(key)
    }
  }
}

export default {
  /**
   * 默认使用localStorage来记录缓存
   */
  ...buildCacheImpl(window.localStorage),
  /**
   * 会话级缓存
   */
  session: buildCacheImpl(window.sessionStorage),
  /**
   * 本地缓存
   */
  local: buildCacheImpl(window.localStorage),
  /**
   * 2FA缓存
   */
  twoFA: {
    ...buildCacheImpl(window.sessionStorage),
    /**
     * 设置认证密码
     *
     * @param value 密码
     * @param rememberPwd 是否记住密码
     */
    setPassword (value, rememberPwd = false) {
      value = md5(value)
      // 记住密码时，默认记住5分钟
      const timeout = 5 * 60 * 1000
      this.set('eva-2fa-password', value, rememberPwd ? timeout : -1)
    },
    /**
     * 获取认证密码
     * @returns {*}
     */
    getPassword () {
      return this.get('eva-2fa-password')
    },
    /**
     * 删除认证密码
     */
    removePassword () {
      this.remove('eva-2fa-password')
    }
  }
}
