module.exports = {
  /**
   * 获取插件查询模型参数
   *
   * @param pluginName 插件名称
   * @param pluginVariables 插件变量，与kit.json中/plugins/xxx插件的variables保持一致
   * @param originalPluginQueryModelParameters 原始插件查询模型参数，从安装时的kit.json中/plugins/xxx插件/qm-values中获取
   * @returns {*|null}
   */
  getPluginQueryModelParameters (pluginName, pluginVariables, originalPluginQueryModelParameters) {
    // 找出插件安装的查询模型变量
    const queryModelVariable = pluginVariables.find(v => v.inputType === 'query_model')
    // 如果没有变量 || 变量值为空(queryModelVariable.value和queryModelVariable.value.value)，则qm-values视为空对象
    if (queryModelVariable == null || queryModelVariable.value == null || queryModelVariable.value.value == null || queryModelVariable.value.value === '') {
      return originalPluginQueryModelParameters || {};
    }
    // 兼容2.15.0之前的版本（kit.json中不存在qm-values的定义）
    if (originalPluginQueryModelParameters == null) {
      return {
        [queryModelVariable.value.value]: pluginVariables
      }
    }
    originalPluginQueryModelParameters[pluginName] = pluginVariables
    return originalPluginQueryModelParameters
  }
}
