export default {
  // 服务租赁类型
  getServiceLeaseTypes($t) {
    return [
      { code: 'FREE', label: $t('service.leaseType.freeLabel'), abbLabel: '' },
      { code: 'TIMES', label: $t('service.leaseType.timesLabel'), abbLabel: $t('service.leaseType.timesAbb') },
      { code: 'MONTH', label: $t('service.leaseType.monthLabel'), abbLabel: $t('service.leaseType.monthAbb') },
      { code: 'YEAR', label: $t('service.leaseType.yearLabel'), abbLabel: $t('service.leaseType.yearAbb') }
    ]
  }
}
