// 生成id
export function generateId () {
  const idNumber = '' + Math.round(Math.random() * 1000) + Date.now() + Math.round(Math.random() * 1000)
  return to36(idNumber)
}
// 转为36进制
export function to36(num) {
  const symbols = '0123456789abcdefghijklmnopqrstuvwxyz';
  let result = '';
  do {
    result = symbols[num % 36] + result;
    num = Math.floor(num / 36);
  } while (num > 0);
  return result;
}
