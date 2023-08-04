import dayjs from 'dayjs'
export default {
  /**
   * 获取时间差文本
   * @param dateText
   * @returns {*}
   */
  getDateOffsetText(dateText) {
    const timestamp = dayjs(dateText)
    const now = new Date().getTime()
    let offset = now - timestamp
    offset = offset <= 0 ? 0 : offset / 1000
    const daySeconds = 3600 * 24
    let tip = '';
    if (offset === 0) {
      tip = '刚刚'
    }
    // 1分钟以内
    else if (offset < 60) {
      tip = '刚刚'
    }
    // 一个小时以内
    else if (offset < 3600) {
      tip = Math.floor(offset / 60) + '分钟前';
    }
    // 一天内
    else if (offset < daySeconds) {
      tip = Math.floor(offset / 3600) + '小时前';
    }
    // 一个月内
    else if (offset < daySeconds * 31) {
      tip = Math.floor(offset / (3600 * 24)) + '天前';
    }
    // 一年内
    else if (offset < daySeconds * 365) {
      tip = Math.floor(offset / (daySeconds * 31)) + '月前';
    }
    else {
      tip = Math.floor(offset / (daySeconds * 365)) + '年前';
    }
    return tip;
  }
}
