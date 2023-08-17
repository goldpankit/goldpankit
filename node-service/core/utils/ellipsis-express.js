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
    if (targetContent == null) {
      return ''
    }
    if (!this.isEllipsis(express)) {
      return targetContent
    }
    targetContent = this.#normalizeContent(targetContent)
    const diffGroups = this.#parse(express)
    // console.log('diffGroups', JSON.stringify(diffGroups, null, 2))
    const contentLines = targetContent.split('\n')
    // 记录上一次的插入索引，用于处理当前这一次的删除范围
    for (const diffGroup of diffGroups) {
      let prefixInsertIndexList = null
      // 差异从后往前处理
      for (let diffIndex = diffGroup.length - 1; diffIndex >= 0; diffIndex--) {
        const diff = diffGroup[diffIndex]
        // 找到插入的位置
        let originInsertIndexList = this.#getInsertIndex(contentLines, diff.markLines)
        if (originInsertIndexList == null) {
          continue
        }
        let insertIndexList = [...originInsertIndexList].reverse()
          .splice(0, diff.diffGroups.length)
          .reverse()
        // console.log('insertIndexList after', insertIndexList)
        // 处理行的增加和删除，需要从后开始处理每一组的变化，避免索引混乱
        for (let i = diff.diffGroups.length - 1; i >= 0; i --) {
          const group = diff.diffGroups[i]
          // 处理删除行
          const deletedLines = group
            .filter(line => line.startsWith('-'))
            .map(line => line.substring(1))
          if (deletedLines.length > 0) {
            // 循环需要删除的行，一一进行删除
            for (const line of deletedLines) {
              // 获取开始删除的内容行索引，开始为为当前差异的开始插入位置
              let startDeleteIndex = insertIndexList[i]
              // 获取结束删除的内容行索引，结束位置为上一次差异的插入位置
              let endDeleteIndex = prefixInsertIndexList == null ? contentLines.length - 1 : prefixInsertIndexList[0]
              // console.log('删除范围', startDeleteIndex, endDeleteIndex, prefixInsertIndexList)
              for (let j = startDeleteIndex; j <= endDeleteIndex; j++) {
                const contentLine = contentLines[j]
                // 已经没有匹配到行，则结束循环
                if (contentLine == null) {
                  break
                }
                // 匹配到对应的行，则删除
                if (contentLine === line) {
                  contentLines.splice(j, 1)
                  break
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
        prefixInsertIndexList = originInsertIndexList
      }
    }
    return contentLines.join('\n')
  }

  /**
   * 反向合并
   */
  revertMerge (express, targetContent) {
    if (!this.isEllipsis(express)) {
      return targetContent
    }
    const contentLines = express.split('\n')
    const revertContentLines = []
    for (const line of contentLines) {
      if (line.trimStart().startsWith('+')) {
        revertContentLines.push(line.replace(/\+/, '-'))
        continue
      }
      if (line.trimStart().startsWith('-')) {
        revertContentLines.push(line.replace(/-/, '+'))
        continue
      }
      revertContentLines.push(line)
    }
    return this.merge(revertContentLines.join('\n'), targetContent)
  }

  /**
   * 判断是否为省略号表达式
   */
  isEllipsis (content) {
    const startIndex = content.indexOf('/...\n')
    const endIndex = content.indexOf('\n.../')
    return startIndex !== -1 && endIndex !== -1 && endIndex > startIndex
  }

  /**
   * 标准化表达式
   * @param express
   */
  #normalizeExpress (express) {
    const expressLines = express.split('\n')
    let lines = []
    for (const line of expressLines) {
      // 把”+“移至最前
      if (line.trimStart().startsWith('+')) {
        lines.push(`+${line.replace(/\+/, '')}`)
        continue
      }
      // 把”-“移至最前
      if (line.trimStart().startsWith('-')) {
        lines.push(`-${line.replace(/-/, '')}`)
        continue
      }
      // 把"..."移至最前
      if (line.trimStart().startsWith('...')) {
        lines.push(`...${line.replace(/\.\.\./, '').trim()}`)
        continue
      }
      // 把带空格的空行都替换成无空格空行
      if (line.trim() === '') {
        lines.push('')
        continue
      }
      lines.push(line)
    }
    // 合并多余的"..."
    const normalized = []
    for (let i = 0; i < lines.length; i++) {
      if (lines[i] == null) {
        break
      }
      if (!lines[i].startsWith('...')) {
        normalized.push(lines[i])
        continue
      }
      if (lines[i] === lines[i + 1]) {
        normalized.push(lines[i])
        i++
        continue
      }
      normalized.push(lines[i])
    }
    return normalized.join('\n')
  }

  /**
   * 标准化内容
   * @param content
   */
  #normalizeContent (content) {
    const contentLines = content.split('\n')
    let normalized = []
    for (const line of contentLines) {
      // 把带空格的空行都替换成无空格空行
      if (line.trim() === '') {
        normalized.push('')
        continue
      }
      normalized.push(line)
    }
    return normalized.join('\n')
  }

  /**
   * 合并多余省略号
   * @param markLines
   */
  #mergeSyntax (markLines) {
    const newMarkLines = []
    for (const line of markLines) {
      if (line === '___diff___' && newMarkLines[newMarkLines.length - 1] === '___diff___') {
        continue
      }
      if (line === '...' && newMarkLines[newMarkLines.length - 1] === '...') {
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
    const diffGroups = []
    express = this.#normalizeExpress(express)
    const expresses = express.split('/...').filter(content => content.trim().endsWith('.../'))
    for (let express of expresses) {
      express = express.substring(0, express.indexOf('.../'))
      express = express.trim()
      const diffGroup = []
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
          const lastDiff = diffGroup[diffGroup.length - 1]
          markLines.unshift('...')
          for (let lineIndex = lastDiff.markLines.length - 1; lineIndex >= 0; lineIndex--) {
            if (lastDiff.markLines[lineIndex] === '___diff___') {
              markLines.unshift('...')
              continue
            }
            markLines.unshift(lastDiff.markLines[lineIndex])
          }
        }
        // 合并语法
        markLines = this.#mergeSyntax(markLines)
        diffGroup.push({
          markLines,
          diffGroups: this.#getDiffLineGroups(lines)
        })
      }
      diffGroups.push(diffGroup)
    }
    return diffGroups
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
