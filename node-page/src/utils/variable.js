// 判断值是否为一个空值
export function isEmptyValue (value) {
  return value == null ||
    value === '' ||
    '[]' === JSON.stringify(value) ||
    '{}' === JSON.stringify(value)
}

// 给定输入类型，返回默认的空值
export function getDefaultEmptyValue (inputType) {
  if (inputType === 'input' || inputType === 'textarea' || inputType === 'radio') {
    return ''
  }
  if (inputType === 'select') {
    return {
      value: null,
      settings: []
    }
  }
  if (inputType === 'checkbox') {
    return []
  }
  if (inputType === 'table' || inputType === 'database' || inputType === 'query_model') {
    return null
  }
  return ''
}
