/**
 * 严格拷贝
 * 按照对象定义的属性进行拷贝
 * @param define 数据定义
 * @param data 数据
 * @returns {*}
 */
export function strictCopy(define, data) {
  if (define == null || data == null) {
    return define
  }
  for (const key in define) {
    define[key] = data[key]
  }
  return define
}
