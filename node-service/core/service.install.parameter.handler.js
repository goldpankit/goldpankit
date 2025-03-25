module.exports = {
  /**
   * 获取插件查询模型参数
   *
   * @param pluginName 插件名称
   * @param pluginVariables 插件变量，与kit.json中/plugins/xxx插件的variables保持一致
   * @param originalQmValues 原始插件查询模型记忆参数，从安装时的kit.json中/plugins/xxx插件/qm-values中获取，用于再次基础上叠加
   * @returns {*|null}
   */
  getPluginQueryModelParameters (pluginName, pluginVariables, originalQmValues) {
    // 找出插件安装的查询模型变量
    const queryModelVariable = pluginVariables.find(v => v.inputType === 'query_model')
    // 如果没有变量 || 变量值为空(queryModelVariable.value和queryModelVariable.value.value)，则qm-values视为空对象
    if (queryModelVariable == null || queryModelVariable.value == null || queryModelVariable.value.value == null || queryModelVariable.value.value === '') {
      return originalQmValues;
    }
    // 兼容2.15.0之前的版本（kit.json中不存在qm-values的定义）
    if (originalQmValues == null) {
      return {
        [queryModelVariable.value.value]: pluginVariables
      }
    }
    originalQmValues[queryModelVariable.value.value] = pluginVariables
    return originalQmValues
  },
  /**
   * 获取插件单表参数
   *
   * @param pluginName 插件名称
   * @param pluginVariables 插件变量，与kit.json中/plugins/xxx插件的variables保持一致
   * @param originalTableValues 原始插件单表记忆参数，从安装时的kit.json中/plugins/xxx插件/table-values中获取，用于再次基础上叠加
   * @returns {*|null}
   */
  getPluginTableParameters (pluginName, pluginVariables, originalTableValues) {
    // 找出插件安装的查询模型变量
    const tableVariable = pluginVariables.find(v => v.inputType === 'table')
    // 如果没有变量 || 变量值为空(tableVariable.value和tableVariable.value.value)，返回原值
    if (tableVariable == null || tableVariable.value == null || tableVariable.value.value == null || tableVariable.value.value === '') {
      return originalTableValues;
    }
    // 兼容2.15.0之前的版本（kit.json中不存在table-values的定义）
    if (originalTableValues == null) {
      return {
        [tableVariable.value.value]: pluginVariables
      }
    }
    originalTableValues[tableVariable.value.value] = pluginVariables
    return originalTableValues
  }
}
