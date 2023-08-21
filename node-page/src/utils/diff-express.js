export default {
  /**
   * 判断是否为差异表达式
   */
  isDiffEllipsis (express) {
    return express.startsWith('/...') && express.endsWith('.../')
  }
}
