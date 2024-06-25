module.exports = {
  // 生成id
  generateId () {
    const idNumber = '' + Math.round(Math.random() * 10000) + Date.now() + Math.round(Math.random() * 10000)
    return this.__to36(idNumber)
  },
  // 转为36进制
  __to36(num) {
    const symbols = '0123456789abcdefghijklmnopqrstuvwxyz';
    let result = '';
    do {
      result = symbols[num % symbols.length] + result;
      num = Math.floor(num / symbols.length);
    } while (num > 0);
    return result.toUpperCase();
  }
}
