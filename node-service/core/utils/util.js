module.exports = {
  /**
   * 判断lines是否连续存在于totalLines中
   * @param lines 目标行集
   * @param totalLines 全部的行集
   */
  containsLines(lines, totalLines) {
    if (lines.length === 0) {
      return true
    }
    if (lines.length > totalLines.length) {
      return false
    }
    const handleLines = lines.map(line => line.trim())
    const handleTotalLines = totalLines.map(line => line.trim())
    if (lines.length === 1) {
      return handleTotalLines.includes(handleLines[0])
    }
    if (lines.length === totalLines.length) {
      return handleLines.join('\n') === handleTotalLines.join('\n')
    }
    return handleTotalLines.join('\n').indexOf(handleLines.join('\n')) !== -1
  },

  /**
   * 找出第一行的索引
   * @param lines 目标行集
   * @param totalLines 全部的行集
   * @param startIndex 搜索的开始索引
   * @param direction 搜索的方向，1表示向下查找，-1表示向上查找
   */
  getFirstLineIndex (lines, totalLines, startIndex, direction) {
    // 根据查找方向获取搜索范围
    let searchLines = totalLines.slice(startIndex)
    if (direction === -1) {
      searchLines = totalLines.slice(0, startIndex)
      /*
      向上查找时，需要进行反序，例如
      - 1
      - 2
      3
      及根据3定位行删除1和2，如果是从上至下开始匹配，则有可能删除了定位行较远的但又一样匹配的行
       */
    }
    // 向下搜索
    if (direction === 1) {
      // 单行
      if (lines.length === 1) {
        return startIndex + searchLines.indexOf(lines[0])
      }
      // 多行，逐行往下匹配
      for (let i = 0; i < searchLines.length; i++) {
        let firstLineIndex = -1
        for (let j = 0; j < lines.length; j++) {
          // 逐行匹配，有一行不匹配，则清空首行索引，并结束循环，进入下一次范围行搜索
          if (lines[j].trim() !== searchLines[i + j].trim()) {
            firstLineIndex = -1
            break
          }
          // 记录匹配的首行坐标
          if (j === 0) {
            firstLineIndex = i
          }
        }
        if (firstLineIndex !== -1) {
          return startIndex + firstLineIndex
        }
      }
    }
    // 向上搜索
    if (direction === -1) {
      if (lines.length === 1) {
        return searchLines.lastIndexOf(lines[0])
      }
      // 多行，逐行往上匹配
      for (let i = searchLines.length - 1; i >= lines.length - 1; i--) {
        let firstLineIndex = -1
        for (let j = lines.length - 1; j >= 0; j--) {
          // 逐行匹配，有一行不匹配，则清空首行索引，并结束循环，进入下一次范围行搜索
          if (lines[j].trim() !== searchLines[i + j - lines.length + 1].trim()) {
            break
          }
          // 记录匹配的首行坐标
          if (j === 0) {
            firstLineIndex = i + j - lines.length + 1
          }
        }
        if (firstLineIndex !== -1) {
          return firstLineIndex
        }
      }
    }
    return -1;
  }
}
