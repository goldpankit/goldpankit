import dayjs from 'dayjs'
export default {
  /**
   * 获取时间差文本
   * @param dateText 时间字符串
   * @param $t 国际化文案获取函数
   * @returns {*}
   */
  getDateOffsetText(dateText, $t) {
    const timestamp = dayjs(dateText)
    const now = new Date().getTime()
    let offset = now - timestamp
    offset = offset <= 0 ? 0 : offset / 1000
    const daySeconds = 3600 * 24
    let tip = '';
    if (offset === 0) {
      tip = $t('common.dateOffset.aMomentAgo')
    }
    // 1分钟以内
    else if (offset < 60) {
      tip = $t('common.dateOffset.aMomentAgo')
    }
    // 一个小时以内
    else if (offset < 3600) {
      tip = $t('common.dateOffset.minutesAgo', { value: Math.floor(offset / 60) });
    }
    // 一天内
    else if (offset < daySeconds) {
      tip = $t('common.dateOffset.hoursAgo', { value: Math.floor(offset / 3600) });
    }
    // 一个月内
    else if (offset < daySeconds * 31) {
      tip = $t('common.dateOffset.daysAgo', { value: Math.floor(offset / (3600 * 24)) })
    }
    // 一年内
    else if (offset < daySeconds * 365) {
      tip = $t('common.dateOffset.monthsAgo', { value: Math.floor(offset / (daySeconds * 31)) })
    }
    else {
      tip = $t('common.dateOffset.yearsAgo', { value: Math.floor(offset / (daySeconds * 365)) })
    }
    return tip;
  },
  // 获取剩余天数
  getRemainingDay (dateText) {
    const timestamp = dayjs(dateText)
    const now = new Date().getTime()
    let offset = timestamp - now
    offset = offset <= 0 ? 0 : offset / 1000
    return Math.ceil(offset / (3600 * 24))
  },
  // 获取文件访问路径
  getAccessUri (value, defaultValue) {
    if (value == null || value === '') {
      return defaultValue
    }
    if (value.startsWith('/resource')) {
      return import.meta.env.VITE_REMOTE_API_PREFIX + value
    }
    return value
  }
}
