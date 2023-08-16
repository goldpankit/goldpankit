import dayjs from 'dayjs'
import { ElMessageBox } from 'element-plus'
export default {
  // 覆盖确认
  overwriteConfirm (files) {
    const $t = this.$t
    return ElMessageBox({
      title: '文件覆盖确认',
      message: '确认覆盖这些文件吗？',
      showCancelButton: true,
      cancelButtonText: $t('common.cancel'),
      confirmButtonText: $t('common.confirm')
    })
  },
  // 覆盖确认
  overwriteAllConfirm () {
    const $t = this.$t
    return ElMessageBox({
      title: '文件覆盖确认',
      message: '确认覆盖所有文件吗？',
      showCancelButton: true,
      cancelButtonText: $t('common.cancel'),
      confirmButtonText: $t('common.confirm')
    })
  },
  // 删除确认
  deleteConfirm (message) {
    const $t = this.$t
    return ElMessageBox({
      title: $t('common.modal.confirmDelete'),
      message: message,
      showCancelButton: true,
      cancelButtonText: $t('common.cancel'),
      confirmButtonText: $t('common.delete'),
      confirmButtonClass: 'danger-button'
    })
  },
  // 确认安装
  installConfirm (price) {
    const $t = this.$t
    return ElMessageBox({
      title: $t('common.modal.confirmInstall'),
      message: $t('common.modal.installServiceTip', { price: price }),
      showCancelButton: true,
      cancelButtonText: $t('common.cancel'),
      confirmButtonText: $t('service.payInstall')
    })
  },
  // 确认卸载
  uninstallConfirm () {
    const $t = this.$t
    return ElMessageBox({
      title: $t('common.modal.confirmUninstall'),
      message: $t('common.modal.uninstallServiceTip'),
      showCancelButton: true,
      cancelButtonText: $t('common.cancel'),
      confirmButtonText: $t('service.uninstall')
    })
  },
  /**
   * 获取时间差文本
   * @param dateText 时间字符串
   * @returns {*}
   */
  getDateOffsetText(dateText) {
    const $t = this.$t
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
