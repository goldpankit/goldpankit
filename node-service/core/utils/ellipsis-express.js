/**
 * 省略号表达式
 * 用途：简易表达出内容A如何插入到内容B中
 */
class EllipsisExpress {
  constructor() {
  }

  /**
   * 合并
   * @param express
   * @param targetContent
   */
  merge (express, targetContent) {
    const diffs = this.#parse(express)
    // console.log('diffs', JSON.stringify(diffs, null, 2))
    const contentLines = targetContent.split('\n')
    for (let diffIndex = 0; diffIndex < diffs.length; diffIndex++) {
      const diff = diffs[diffIndex]
      // 找到插入的位置
      let insertIndexList = this.#getInsertIndex(contentLines, diff.markLines)
      console.log('insertIndexList', insertIndexList)
      if (insertIndexList == null) {
        continue
      }
      insertIndexList = insertIndexList.reverse()
        .splice(0, diff.diffGroups.length)
        .reverse()

      // 处理行的增加和删除，需要从后开始处理每一组的变化，避免索引混乱
      for (let i = diff.diffGroups.length - 1; i >= 0; i --) {
        const group = diff.diffGroups[i]
        // 处理删除行
        const deletedLines = group
          .filter(line => line.trimStart().startsWith('-'))
          .map(line => line.trimStart().substring(1))
        if (deletedLines.length > 0) {
          // 循环需要删除的行，一一进行删除
          for (const line of deletedLines) {
            // 获取开始删除的内容行索引
            let startDeleteIndex = insertIndexList[i]
            // 获取结束删除的内容行索引
            let endDeleteIndex = insertIndexList[i - 1] == null ? contentLines.length - 1 : insertIndexList[i + 1]
            console.log('删除位置', startDeleteIndex, endDeleteIndex, insertIndexList)
            for (let j = startDeleteIndex; j <= endDeleteIndex; j++) {
              const contentLine = contentLines[j]
              // 已经没有匹配到行，则结束循环
              if (contentLine == null) {
                break
              }
              // 匹配到对应的行，则删除
              if (contentLine === line) {
                contentLines.splice(j, 1)
              }
            }
          }
        }
        // 处理添加行
        contentLines.splice(insertIndexList[i], 0, ...group
          .filter(line => line.trimStart().startsWith('+'))
          .map(line => line.trimStart().substring(1))
        )
      }
    }
    return contentLines.join('\n')
  }

  /**
   * 合并多余省略号
   * @param markLines
   */
  #mergeEllipsis (markLines) {
    const newMarkLines = []
    for (const line of markLines) {
      if (line === '___diff___' && newMarkLines[newMarkLines.length - 1] === '___diff___') {
        continue
      }
      newMarkLines.push(line)
    }
    return newMarkLines
  }

  /**
   * 获取差异行组
   * @param lines
   * @returns {*[]}
   */
  #getDiffLineGroups (lines) {
    const lineGroups = []
    let lineGroup = []
    for (const line of lines) {
      // 非差异语句，将组添加至组列表
      if (!line.trimStart().startsWith('+') && !line.trimStart().startsWith('-')) {
        if (lineGroup.length > 0) {
          lineGroups.push(lineGroup)
        }
        lineGroup = []
        continue
      }
      // 差异语句，将语句添加至组
      lineGroup.push(line)
    }
    // 如果存在差异语句，继续添加到组
    if (lineGroup.length > 0) {
      lineGroups.push(lineGroup)
    }
    return lineGroups
  }

  /**
   * 解析表达式
   * @param express 表达式
   * @returns {*[]}
   */
  #parse (express) {
    const expresses = express.split('/...').filter(content => content.trim().endsWith('.../'))
    const diffs = []
    for (let express of expresses) {
      express = express.substring(0, express.indexOf('.../'))
      express = express.trim()
      const subExpresses = express.split('\n...\n')
      for (let i in subExpresses) {
        i = parseInt(i)
        const subExp = subExpresses[i]
        const lines = subExp.split('\n')
        let markLines = lines.map(line => {
          if (line.trimStart().startsWith('+') || line.trimStart().startsWith('-')) {
            return '___diff___'
          }
          return line
        })
        // 后面的标记行，要添加前面的标记行
        if (i > 0) {
          const lastDiff = diffs[diffs.length - 1]
          markLines.unshift('...')
          for (let lineIndex = lastDiff.markLines.length - 1; lineIndex >= 0; lineIndex--) {
            if (lastDiff.markLines[lineIndex] === '___diff___') {
              markLines.unshift('...')
              continue
            }
            markLines.unshift(lastDiff.markLines[lineIndex])
          }
        }
        // 合并省略号
        markLines = this.#mergeEllipsis(markLines)
        diffs.push({
          markLines,
          diffGroups: this.#getDiffLineGroups(lines)
        })
      }
    }
    return diffs
  }

  /**
   * 获取插入位置
   * @param contentLines
   * @param markLines
   * @param searchIndex
   * @returns {number|*|null}
   */
  #getInsertIndex (contentLines, markLines, searchIndex = 0) {
    // 找到匹配的第一行坐标
    let startIndex = -1
    let insertIndexList = []
    const firstMarkLine = markLines[0]
    // 如果标记行为start，则视为直接添加到内容最顶部
    if (firstMarkLine === 'start') {
      return [0]
    }
    // 如果标记行为end，则视为直接添加到内容最底部
    if (firstMarkLine === 'end') {
      return [contentLines.length - 1]
    }
    for (let i = searchIndex; i < contentLines.length; i++) {
      const contentLine = contentLines[i]
      if (contentLine === firstMarkLine) {
        startIndex = i
        break
      }
    }
    // 没有获取到首行坐标，则认为表达式没有查询到对应目标
    if (startIndex === -1) {
      return null
    }
    // 从第二行标记行开始，继续在内容行中查找，直到完全匹配
    let searchOffset = 1
    let newRound = true
    for (let i = 1; i < markLines.length; i++) {
      const markLine = markLines[i]
      // 省略语句，搜索范围调整至内容的最后
      if (markLine === '...') {
        searchOffset = contentLines.length - startIndex + 1
        newRound = true
        continue
      }
      // 差异语句，不调整搜索范围（如果上一轮是省略句，则保留查询至内容的最后）
      if (markLine === '___diff___') {
        newRound = true
        continue
      }
      // 在检索范围内查找内容行，如果发现内容行等于标记行，则记录结束索引，否则视为不匹配
      let matched = false
      // 计算搜索开始位置，如果已经获取到了插入位置，则从插入位置开始搜索，否则从首行标记行的坐标+1开始搜索
      let searchStartIndex = insertIndexList.length > 0 ? insertIndexList[insertIndexList.length - 1] : (startIndex + 1)
      // 计算搜索结束位置
      let searchEndIndex = searchStartIndex + searchOffset
      for (let j = searchStartIndex; j < searchEndIndex; j++) {
        const contentLine = contentLines[j]
        // 没有检索行时，结束循环
        if (contentLine == null) {
          break
        }
        // 找到标记行，添加插入索引或更换插入索引
        if (contentLine === markLine) {
          matched = true
          // 如果不是新一轮检索，则更换索引
          if (!newRound) {
            insertIndexList[insertIndexList.length - 1] = j + 1
          }
          // 如果是新一轮检索，则添加插入索引
          else {
            insertIndexList.push(j + 1)
          }
          break
        }
      }
      // 如果存在一个标记行未匹配，则调整检索索引并重新检索
      if (!matched) {
        return this.#getInsertIndex(contentLines, markLines, startIndex+1)
      }
      // 修改检索范围为1，实现连续标记语句的检索
      searchOffset = 1
      // 进入下一次标记语句检索前标记为非新的一轮，只有到__diff__和...时才是新一轮的检测
      newRound = false
    }
    return insertIndexList
  }
}
module.exports = new EllipsisExpress()
