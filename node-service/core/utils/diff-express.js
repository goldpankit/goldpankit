// 差异行操作类型
const OPERA_TYPE = {
  DELETE: 'DELETE', // 删除行
  INSERT: 'INSERT', // 新增行
  INCORRECT: 'INCORRECT' // 不正确的差异行
}
// 差异行方向
const DIRECTION = {
  TOP: 'TOP', // 差异行全在定位行顶部
  BOTTOM: 'BOTTOM', // 差异行全在定位行底部
  CENTER: 'CENTER', // 差异行在定位行中间
  INCORRECT: 'INCORRECT' // 不正确的表达式
}
/**
 * 差异行，表示新增或删除的行对象
 */
class DiffLine {
  // 行内容
  content;
  // 操作类型, DELETE删除，INSERT插入
  operaType;
  // 目标行索引
  lineIndex;
  constructor(lineIndex, content) {
    this.lineIndex = lineIndex
    this.content = content
    this.operaType = this.#getDiffLineOperaType(content)
  }

  /**
   * 获取差异行操作类型
   * @param diffLineString 差异行内容
   */
  #getDiffLineOperaType (diffLineString) {
    if (diffLineString.startsWith('+')) {
      return OPERA_TYPE.INSERT
    }
    if (diffLineString.startsWith('-')) {
      return OPERA_TYPE.DELETE
    }
    return OPERA_TYPE.INCORRECT
  }
}

/**
 * 差异组，一个表达式由若干个差异组组成，组中包含差异行记录
 */
class DiffGroup {
  // 差异行，最后的差异行在最顶部
  diffLines;
  // 定位行
  positionLines;
  // 表达式行
  expressLines;
  // 表达式配置
  config;
  // 差异行相对定位行的方向
  direction;

  constructor(diffLines, direction, positionLines, expressGroup) {
    this.config = expressGroup.config
    this.expressLines = expressGroup.lines
    this.direction = direction
    this.positionLines = positionLines
    this.diffLines = diffLines
  }
}

/**
 * 差异表达式
 */
class DiffExpress {
  /**
   * 合并
   * 按找表达式组一组一组合并，合并失败的组组装起来作为errorExpress（错误的表达式），所以即使失败了，也可能存在自动合并的部分
   * @param express 表达式
   * @param content 目标内容
   * @return result = {
   *   success: 是否成功,
   *   errorExpress: 错误的表达式,
   *   content: 合并结果
   * }
   */
  merge (express, content) {
    const normalizedExpress = this.#normalizeExpress(express)
    // 如果内容为空，视为合并失败，返回表达式本身
    if (content == null || content === '') {
      return normalizedExpress
    }
    // 如果不是正确的表达式，视为不应合并，返回内容本身
    if (!this.isDiffEllipsis(normalizedExpress)) {
      return content
    }
    const normalizedContent = this.#normalizeContent(content)
    const contentLines = this.#getLines(normalizedContent)
    const diffGroups = this.getDiffGroups(normalizedExpress, contentLines)
    // 解析失败的组
    const errorGroups = []
    // 解析组
    for (const diffGroup of diffGroups) {
      if (diffGroup.error) {
        errorGroups.push(diffGroup)
        continue
      }
      // 解析组内删除行
      const deletedLines = diffGroup.diffLines.filter(diffLine => diffLine.operaType === OPERA_TYPE.DELETE)
      for (const diffLine of deletedLines) {
        // 匹配到了删除的行
        if (this.#eq(diffLine.content.substring(1), contentLines[diffLine.lineIndex])) {
          contentLines.splice(diffLine.lineIndex, 1)
        }
        // 未匹配到删除的行，添加到错误组中
        else {
          errorGroups.push({
            ...diffGroup,
            error: true,
            message: `can not match diff line '${diffLine.content.substring(1)}'.`
          })
          break
        }
      }
      // 解析组内新增行
      const insertLines = diffGroup.diffLines.filter(diffLine => diffLine.operaType === OPERA_TYPE.INSERT)
      if (!this.#existsLines(insertLines, contentLines)) {
        for (const diffLine of insertLines) {
          contentLines.splice(diffLine.lineIndex, 0, diffLine.content.substring(1))
        }
      }
    }
    // 如果存在解析失败的组，则把解析失败的组构建为差异字符串后返回
    let errorExpress = ''
    if (errorGroups.length > 0) {
      errorExpress = this.#toDiffExpress(errorGroups)
    }
    return {
      success: errorExpress === '',
      errorExpress,
      content: this.#linesToText(contentLines)
    }
  }

  /**
   * 反向合并
   * @param express 表达式
   * @param content 内容
   */
  revertMerge (express, content) {
    return this.merge(this.getRevertExpress(express), content)
  }

  /**
   * 获取反向合并表达式，原来删除变成新增，新增变成删除
   * @param express
   * @returns {*}
   */
  getRevertExpress (express) {
    const expressLines = this.#getLines(express)
    expressLines.forEach((line, index) => {
      const trimStartedLine = line.trimStart()
      // 新增行表达式，将+调整为-
      if (trimStartedLine.startsWith('+')) {
        expressLines[index] = line.replace(/\+/, '-')
        return
      }
      // 删除行表达式，将+调整为-
      if (trimStartedLine.startsWith('-')) {
        expressLines[index] = line.replace(/-/, '+')
        return
      }
    })
    return this.#linesToText(expressLines)
  }

  /**
   * 获取差异组
   */
  getDiffGroups (express, contentLines) {
    const totalExpressLines = this.#getLines(express)
    // 去掉第一行中的/，让/...变成...
    totalExpressLines[0] = totalExpressLines[0].substring(1)
    // 去掉最后的.../
    totalExpressLines.pop()
    /**
     * 表达式组，组内为若干个数组，组内的每个数组为表达式行字符串
     * 如：
     * [
     *     {
     *        config: '{差异配置} 差异注释', // 差异组配置
     *        lines: ['aaaaaaa','+bbbbbbb'] // 差异行，表示在a后插入b
     *     },
     *     ...
     * ]
     */
    const expressGroups = []
    let expressLines = []
    for (const line of totalExpressLines) {
      if (line.startsWith('...')) {
        expressLines = []
        expressGroups.push({
          // 组配置
          config: line.substring(3).trim(),
          // 组表达式行
          lines: expressLines
        })
        continue
      }
      expressLines.push(line)
    }
    const diffGroups = []
    for (const expressGroup of expressGroups) {
      // 过滤掉没有差异行的组（连续的...就会出现没有差异行的组，这里做容错处理）
      if (expressGroup.lines.length === 0) {
        continue
      }
      diffGroups.unshift(this.getDiffGroup(expressGroup, contentLines))
    }
    return diffGroups
  }

  /**
   * 为表达式组获取差异组对象
   * @param expressGroup 表达式组
   * @param contentLines 内容行数组
   */
  getDiffGroup (expressGroup, contentLines) {
    // 组内差异行数组
    const expressLines = expressGroup.lines
    // 找到定位行
    const positionLines = this.#getPositionLines(expressLines, contentLines)
    if (positionLines.length === 0) {
      return {
        error: true,
        message: 'no position lines.',
        expressLines: expressLines,
        config: expressGroup.config,
      }
    }
    const diffLines = []
    const firstDiffLineString = this.#getFirstDiffLineString(expressLines)
    if (firstDiffLineString == null) {
      return {
        error: true,
        message: 'no diff lines.',
        expressLines: expressLines,
        config: expressGroup.config,
      }
    }
    let positionDirection = this.#getPositionLinesDirection(firstDiffLineString, positionLines, expressLines)
    const diffLineStrings = this.#getDiffLineStrings(expressLines)
    /**
     * 差异行全都在最顶部的处理逻辑
     * + aaaa
     * + bbbb
     * - cccc
     * - dddd
     * + eeee
     * 0000000
     * 其中0表示定位行，abe为新增行，cd为删除行，先处理删除后处理新增，可以得到：
     * 删除行索引 = 第一条定位行 - 删除索引（c为1，d为2）
     * 新增行索引 = 第一条定位行
     */
    if (positionDirection === DIRECTION.TOP) {
      // 获取第一行定位行的索引
      const firstPositionLine = positionLines[0]
      let deleteCount = 0
      // 添加新增行记录
      for (let i = 0; i < diffLineStrings.length; i++) {
        const line = diffLineStrings[i]
        const operaType = this.#getDiffLineOperaType(line)
        if (operaType === OPERA_TYPE.INSERT) {
          diffLines.push(new DiffLine(
            firstPositionLine.index,
            line
          ))
        }
      }
      // 添加删除行记录
      const deleteTotal = this.#countDeleteLines(expressLines)
      for (let i = 0; i < diffLineStrings.length; i++) {
        const line = diffLineStrings[i]
        const operaType = this.#getDiffLineOperaType(line)
        if (operaType === OPERA_TYPE.DELETE) {
          diffLines.push(new DiffLine(
            firstPositionLine.index - deleteTotal + deleteCount,
            line
          ))
          deleteCount++
        }
      }
    }
    /**
     * 差异行全都在最底部的处理逻辑
     * 000000
     * - aaa
     * - bbbb
     * + ccccc
     * - ddddd
     * + eeeee
     * 其中0为定位行，先处理abd的删除，再处理ce的增加，那么可以得到
     * 新增行索引 = 最后一条定位行索引 + 1（因为是先插入e，再插入c，所以e和c的索引是一致的）
     * 删除行索引 = 最后一条定位行索引 + 删除索引
     */
    else if (positionDirection === DIRECTION.BOTTOM || positionDirection === DIRECTION.CENTER) {
      /**
       * 获取最后一行定位行的索引
       * 因为存在差异行上下都存在定位行的情况，所以可得
       * 最后一条定位行 = 定位行记录中从后往前找，第一条 定位行在表达式中的索引 < 首行差异行的索引的定位行
       */
      let lastPositionLine = positionLines[positionLines.length - 1]
      const firstDiffLineIndex = expressLines.findIndex(line => line === firstDiffLineString)
      let lastPositionIndex = positionLines.length - 1
      while (lastPositionIndex >= 0) {
        lastPositionLine = positionLines[lastPositionIndex]
        if (lastPositionLine.expressIndex < firstDiffLineIndex) {
          break
        }
        lastPositionIndex--
      }
      let deleteIndex = 1
      // 添加新增行记录
      for (let i = 0; i < diffLineStrings.length; i++) {
        const line = diffLineStrings[i]
        const operaType = this.#getDiffLineOperaType(line)
        if (operaType === OPERA_TYPE.INSERT) {
          diffLines.push(new DiffLine(
            lastPositionLine.index + 1,
            line
          ))
        }
      }
      // 添加删除行记录
      for (let i = 0; i < diffLineStrings.length; i++) {
        const line = diffLineStrings[i]
        const operaType = this.#getDiffLineOperaType(line)
        if (operaType === OPERA_TYPE.DELETE) {
          diffLines.push(new DiffLine(
            lastPositionLine.index + deleteIndex,
            line
          ))
          deleteIndex++
        }
      }
    }
    diffLines.reverse()
    return new DiffGroup(diffLines, positionDirection, positionLines, expressGroup)
  }

  /**
   * 判断新行是否已存在
   * @param newLines 新行
   * @param contentLines 内容行
   */
  #existsLines (newLines, contentLines) {
    const content = this.#linesToText(contentLines.map(line => line.trim()))
    // 获取新行的内容（差异行都是从后往前处理的，这里要做一下反转）
    const copyNewLines = JSON.parse(JSON.stringify(newLines.map(item => item.content.substring(1).trim())))
    copyNewLines.reverse()
    return content.indexOf(this.#linesToText(copyNewLines)) !== -1
  }

  /**
   * 获取行在内容中的索引
   * @param targetLine 目标行内容
   * @param contentLines 目标内容行数组
   * @param searchStartIndex 开始搜索位置
   * @returns {number}
   */
  #getLineIndex(targetLine, contentLines, searchStartIndex = 0) {
    for (let i = searchStartIndex; i < contentLines.length; i++) {
      if (this.#eq(targetLine, contentLines[i])) {
        return i
      }
    }
    return -1
  }

  /**
   * 找到定位行
   * @param expressLines 表达式行数组
   * @param contentLines 内容行数组
   * @param searchStartIndex 搜索开始索引
   */
  #getPositionLines (expressLines, contentLines, searchStartIndex = 0) {
    let positionLines = []
    for (let i = 0; i < expressLines.length; i++) {
      const line = expressLines[i]
      if (!line.startsWith('+') && !line.startsWith('-')) {
        if (positionLines.length > 0) {
          searchStartIndex = positionLines[positionLines.length - 1].index
        }
        const index = this.#getLineIndex(line, contentLines, searchStartIndex)
        if (index === -1) {
          return []
        }
        // 不是连续的，重新查找
        if (searchStartIndex !== 0 && (index - 1) !== searchStartIndex) {
          return this.#getPositionLines(expressLines, contentLines, searchStartIndex + 1)
        }
        positionLines.push({
          content: line,
          index,
          expressIndex: i
        })
      }
    }
    return positionLines
  }

  /**
   * 获取表达式中第一行差异行内容
   * @param expressLines 表达式行数组
   * @returns {*}
   */
  #getFirstDiffLineString (expressLines) {
    return expressLines.find(line => line.startsWith('+') || line.startsWith('-'))
  }

  /**
   * 获取表达式行中所有的差异行内容
   * @param expressLines
   * @returns {*}
   */
  #getDiffLineStrings (expressLines) {
    return expressLines.filter(line => line.startsWith('+') || line.startsWith('-'))
  }

  /**
   * 统计表达式行中删除行的数量
   * @param expressLines
   * @returns {*}
   */
  #countDeleteLines (expressLines) {
    return expressLines.filter(line => line.startsWith('-')).length
  }

  /**
   * 获取定位行相对差异行内容的方向
   * @param diffLineString 差异行内容
   * @param positionLines 定位行数组
   * @param expressLines 表达式行数组
   */
  #getPositionLinesDirection (diffLineString, positionLines, expressLines) {
    const diffLineIndex = expressLines.findIndex(line => this.#eq(line, diffLineString))
    const firstPositionLineIndex = expressLines.findIndex(line => this.#eq(line, positionLines[0].content))
    const lastPositionLineIndex = expressLines.findIndex(line => this.#eq(line, positionLines[positionLines.length - 1].content))
    // - 差异行行全都在最顶部
    if (diffLineIndex < firstPositionLineIndex) {
      return DIRECTION.TOP
    }
    // - 定位行全都在最顶部
    if (diffLineIndex > lastPositionLineIndex) {
      return DIRECTION.BOTTOM
    }
    // - 定位行一部分在顶部一部分在底部
    if (diffLineIndex < lastPositionLineIndex && diffLineIndex > firstPositionLineIndex) {
      return DIRECTION.CENTER
    }
    // - 表达式不正确
    return DIRECTION.INCORRECT
  }

  /**
   * 获取行
   * @param string
   * @returns {*}
   */
  #getLines (string) {
    const lines = string.split('\n')
    lines.forEach((line, index) => {
      if (line.endsWith('\r')) {
        lines[index] = line.substring(0, line.length - 1)
      }
    })
    return lines
  }

  /**
   * 将行数组转为文本
   * @param lines 行数组
   * @returns {*}
   */
  #linesToText (lines) {
    return lines.join('\n')
  }

  /**
   * 将组转为差异表达式
   * @param groups 组
   */
  #toDiffExpress(groups) {
    const expressLines = []
    for (const group of groups) {
      expressLines.push(`...${group.config} [ERROR: ${group.message}]`)
      group.expressLines.forEach(line => {
        expressLines.push(line)
      })
    }
    expressLines[0] = `/${expressLines[0]}`
    expressLines.push('.../')
    return this.#linesToText(expressLines)
  }

  /**
   * 比较行
   * @param line1 行1
   * @param line2 行2
   * @param config 比较配置，从...后面获取
   */
  #eq (line1, line2, config) {
    return line1 != null && line2 != null && line1.trim() === line2.trim()
  }

  /**
   * 规范化表达式
   * @param express
   */
  #normalizeExpress (express) {
    const expressLines = this.#getLines(express)
    expressLines.forEach((line, index) => {
      const trimStartedLine = line.trimStart()
      // “开始”或“结束”表达式，去掉前后方的空格
      if (trimStartedLine.startsWith('/...') || trimStartedLine.startsWith('.../')) {
        expressLines[index] = line.trim()
        return
      }
      // 新增行表达式，将+提取到最前方
      if (trimStartedLine.startsWith('+')) {
        expressLines[index] = `+${line.replace(/\+/, '')}`
        return
      }
      // 删除行表达式，将-提取到最前方
      if (trimStartedLine.startsWith('-')) {
        expressLines[index] = `-${line.replace(/-/, '')}`
        return
      }
      // 分割表达式，去掉前后方的空格
      if (trimStartedLine.startsWith('...')) {
        expressLines[index] = line.trim()
        return
      }
      // 空行，去掉前后方空格
      if (line.trim() === '') {
        expressLines[index] = line.trim()
      }
    })
    return this.#linesToText(expressLines).trim()
  }

  /**
   * 规范化内容
   * @param content
   */
  #normalizeContent (content) {
    const contentLines = this.#getLines(content)
    contentLines.forEach((line, index) => {
      // 空行，去掉前后方空格
      if (line.trim() === '') {
        contentLines[index] = line.trim()
      }
    })
    return this.#linesToText(contentLines)
  }

  /**
   * 获取差异行操作类型
   * @param diffLineString 差异行内容
   */
  #getDiffLineOperaType (diffLineString) {
    if (diffLineString.startsWith('+')) {
      return OPERA_TYPE.INSERT
    }
    if (diffLineString.startsWith('-')) {
      return OPERA_TYPE.DELETE
    }
    return OPERA_TYPE.INCORRECT
  }

  /**
   * 判断是否为差异表达式
   */
  isDiffEllipsis (express) {
    const normalizedExpress = this.#normalizeExpress(express)
    return normalizedExpress.startsWith('/...') && normalizedExpress.endsWith('.../')
  }

}

module.exports = new DiffExpress()
