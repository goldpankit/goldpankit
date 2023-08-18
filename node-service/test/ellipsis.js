// 差异行操作类型
const OPERA_TYPE = {
  DELETE: 'DELETE',
  INSERT: 'INSERT'
}
// 差异行方向
const DIRECTION = {
  TOP: 'TOP', // 差异行全在定位行顶部
  BOTTOM: 'BOTTOM', // 差异行全在定位行底部
  CENTER: 'CENTER' // 差异行在定位行中间
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
    return null
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

  constructor(diffLines, positionLines, expressLines, ) {
    this.expressLines = expressLines
    this.positionLines = positionLines
    this.diffLines = diffLines
  }
}

/**
 * 省略号表达式
 */
class EllipsisExpress {
  /**
   * 合并
   * @param express 表达式
   * @param content 目标内容
   */
  merge (express, content) {
    const contentLines = this.#getLines(content)
    const diffGroups = this.getDiffGroups(express, contentLines)
    // 存在解析失败的组
    if (diffGroups.findIndex(group => group.error) !== -1) {
      return express
    }
    for (const diffGroup of diffGroups) {
      for (const diffLine of diffGroup.diffLines) {
        // 新增
        if (diffLine.operaType === OPERA_TYPE.INSERT) {
          contentLines.splice(diffLine.lineIndex, 0, diffLine.content.substring(1))
          continue
        }
        // 删除
        if (diffLine.operaType === OPERA_TYPE.DELETE) {
          if (this.#eq(diffLine.content.substring(1), contentLines[diffLine.lineIndex])) {
            contentLines.splice(diffLine.lineIndex, 1)
          }
        }
      }
    }
    return contentLines.join('\r\n')
  }

  /**
   * 获取差异组
   */
  getDiffGroups (express, contentLines) {
    // 去掉首尾
    const totalExpressLines = this.#getLines(express)
    totalExpressLines.pop()
    totalExpressLines.shift()
    /**
     * 表达式组，组内为若干个数组，组内的每个数组为表达式行字符串
     * 如：
     * [
     *     ['aaaaaaa','+bbbbbbb'], // 表示在a后插入b
     *     ['ccccccc','+ddddddd', 'eeeeeeeee'], // 表示在c和e之间插入d
     * ]
     */
    const expressLinesGroup = []
    let expressLines = []
    for (const line of totalExpressLines) {
      if (line.startsWith('...')) {
        expressLinesGroup.push(expressLines)
        expressLines = []
        continue
      }
      expressLines.push(line)
    }
    if (expressLines.length > 0) {
      expressLinesGroup.push(expressLines)
    }
    const diffGroups = []
    for (const expressGroup of expressLinesGroup) {
      diffGroups.unshift(this.getDiffGroup(expressGroup, contentLines))
    }
    return diffGroups
  }

  /**
   * 为表达式组获取差异组对象
   * @param expressLines 表达式行数组
   * @param contentLines 内容行数组
   */
  getDiffGroup (expressLines, contentLines) {
    // 找到定位行
    const positionLines = []
    for (const line of expressLines) {
      if (!line.startsWith('+') && !line.startsWith('-')) {
        let searchStartIndex = 0
        if (positionLines.length > 0) {
          searchStartIndex = positionLines[positionLines.length - 1].index
        }
        const index = this.#getLineIndex(line, contentLines, searchStartIndex)
        if (index === -1) {
          return null
        }
        positionLines.push({
          content: line,
          index
        })
      }
    }
    if (positionLines.length === 0) {
      return { error: true, message: 'no position lines' }
    }
    // 构建差异行，分成三种情况
    const diffLines = []
    const firstDiffLine = this.#getFirstDiffLineString(expressLines)
    if (firstDiffLine == null) {
      return { error: true, message: 'no diff lines' }
    }
    let positionDirection = this.#getPositionLinesDirection(firstDiffLine, positionLines, expressLines)
    const diffLineStrings = this.#getDiffLineStrings(expressLines)
    // - 差异行全都在最顶部
    if (positionDirection === DIRECTION.TOP) {
      // 获取第一行定位行的索引
      const firstPositionLine = positionLines[0]
      for (let i = 0; i < diffLineStrings.length; i++) {
        diffLines.unshift(new DiffLine(
          firstPositionLine.index - i - 1,
          diffLineStrings[i]
        ))
      }
    }
    // - 差异行全都在最底部
    else if (positionDirection === DIRECTION.BOTTOM) {
      // 获取第一行定位行的索引
      const lastPositionLine = positionLines[positionLines.length - 1]
      let deleteIndex = 1
      /**
       * 先将所有新增记录添加到差异行数组中，然后将所有删除记录添加到差异行数组中，
       * 最后差异行数组进行反序，这样使得每次处理时都是先处理删除的行再做添加。举个例子
       * 000000
       * - aaa
       * - bbbb
       * + ccccc
       * - ddddd
       * + eeeee
       * 其中0为定位行，先处理abd的删除，再处理ce的增加，那么
       * 新增行的索引 = 最后一条定位行 + 1（因为是先插入e，再插入c，所以e和c的索引是一致的）
       * 删除行的索引 = 最后一条定位行 + 删除索引
       */
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
    // - 定位航一部分在顶部一部分在底部
    // TODO
    diffLines.reverse()
    return new DiffGroup(diffLines, positionLines, expressLines)
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
    // - 定位航一部分在顶部一部分在底部
    return DIRECTION.CENTER
  }

  /**
   * 获取行
   * @param string
   * @returns {*}
   */
  #getLines (string) {
    return string.split('\r\n')
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
    return null
  }

}

module.exports = new EllipsisExpress()
