import cache from '@/plugins/cache'
import axiosInstance from './index'
const requestMethods = ['get', 'post', 'delete', 'put', 'head', 'options', 'patch', 'request']
const extendsMethods = {}

/**
 * 构建基础请求对象Promise代理对象
 *
 * @param method 请求方式
 * @param args 请求参数
 * @returns {{__access(*, *=): *, finally(): *, then(): *, catch(): *, __result_promise: null, __arguments: *}|*}
 */
const buildBasePromiseProxy = (method, args) => {
  return {
    // post，get等请求方法的调用参数
    __arguments: args,
    // 请求结果的promise对象
    __result_promise: null,
    // 代理then方法，直接调用目标promise的then方法
    then () {
      return this.__access('then', arguments)
    },
    // 代理catch方法，直接调用目标promise的catch方法
    catch () {
      return this.__access('catch', arguments)
    },
    // 代理finally方法，直接调用目标promise的finally方法
    finally () {
      return this.__access('finally', arguments)
    },
    __access (methodName, args) {
      if (this.__result_promise != null) {
        return this.__result_promise[methodName].apply(this.__result_promise, args)
      }
      // 发送请求
      if (this.__result_promise == null) {
        this.__result_promise = axiosInstance[method].apply(axiosInstance, this.__arguments)
      }
      // 如果开启了缓存，则在请求成功后写入缓存
      if (this.__with_cache) {
        this.__result_promise.then(data => {
          this.__cache_impl.set(this.__cache_key, data)
          return data
        })
      }
      return this.__result_promise[methodName].apply(this.__result_promise, args)
    }
  }
}

/**
 * 构建缓存请求对象Promise代理对象
 *
 * @param cacheKey 缓存key
 * @param method 请求方式
 * @param args 请求参数
 * @param cacheImplName 缓存实现名称
 * @returns {{cache(): *, __with_cache: boolean, __cache_key: *, __cache_impl: *}|Promise<any>|buildCachePromiseProxy}
 */
const buildCachePromiseProxy = (cacheKey, method, args, cacheImplName) => {
  return {
    // 缓存标记
    __with_cache: true,
    // 缓存key
    __cache_key: cacheKey,
    // 缓存实现
    __cache_impl: cache[cacheImplName],
    // 从缓存中获取数据
    cache () {
      // 从缓存中获取数据
      const data = this.__cache_impl.get(cacheKey)
      // 如果从缓存中获取到了数据，则直接构造一个成功的promise
      if (data != null) {
        this.__result_promise = Promise.resolve(data)
      }
      // 如果已经获取到了数据，则由以上成功的promise来接手then和catch的处理
      if (this.__result_promise != null) {
        return this.__result_promise
      }
      return this
    }
  }
}

/**
 * 扩展方法：开启缓存
 *
 * @param cacheKey 缓存的key
 * @param isLocal 是否缓存到本地缓存LocalStorage，为false时缓存到SessionStorage
 * @usage：request.cache('test').[post(), get()...]
 * @returns {{isExtendsAxiosInstance: boolean, post: Function, get: Function, ...}}
 */
extendsMethods.cache = function (cacheKey, isLocal = false) {
  if (cacheKey == null) {
    throw Error('Request cache key can not be null.')
  }
  let cacheAxiosInstance = {
    // 标记为axios扩展实例，用于与原生axios作区分
    isExtendsAxiosInstance: true
  }
  if (this.isExtendsAxiosInstance) {
    cacheAxiosInstance = this
  }
  for (const method of requestMethods) {
    if (cacheAxiosInstance[method] == null) {
      cacheAxiosInstance[method] = function () {
        return {
          ...buildBasePromiseProxy(method, arguments),
          ...buildCachePromiseProxy(cacheKey, method, arguments, isLocal ? 'local' : 'session')
        }
      }
      continue
    }
    // 不为null时说明在调用cache前调用了其他扩展方法，此时诸如post，get方法的返回值做合并，防止扩展方法丢失。
    const originMethod = cacheAxiosInstance[method]
    cacheAxiosInstance[method] = function () {
      const request = originMethod()
      Object.assign(request, {
        ...buildBasePromiseProxy(method, arguments),
        ...buildCachePromiseProxy(cacheKey, method, arguments, isLocal ? 'local' : 'session')
      })
      return request
    }
  }
  // 添加扩展方法
  for (const key in extendsMethods) {
    cacheAxiosInstance[key] = extendsMethods[key]
  }
  return cacheAxiosInstance
}

export default extendsMethods
