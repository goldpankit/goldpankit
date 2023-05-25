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
    console.log('diffs', diffs)
    // const contentLines = targetContent.split('\n')
    // for (const diff of diffs) {
    //   const markLines = diff.markLines
    //   // 找到插入的位置
    //   const insertIndex = this.#getInsertIndex(contentLines, markLines)
    //   // console.log('位置信息', positionInfo)
    //   // 处理删除行
    //   // 处理添加行
    //   contentLines.splice(insertIndex, 0, ...diff.newLines)
    // }
    // return contentLines.join('\n')
  }

  /**
   * 合并多余省略号
   * @param markLines
   */
  #mergeEllipsis (markLines) {
    const newMarkLines = []
    for (const line of markLines) {
      if (line === '...' && newMarkLines[newMarkLines.length - 1] === '...') {
        continue
      }
      newMarkLines.push(line)
    }
    return newMarkLines
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
        const lines = subExp.split('\n').filter(line => line !== '')
        // let markLines = lines.filter(line => !line.startsWith('+') && !line.startsWith('-'))
        let markLines = lines.map(line => {
          if (line.startsWith('+') || line.startsWith('-')) {
            return '...'
          }
          return line
        })
        // 后面的标记行，要添加前面的标记行
        if (i > 0) {
          const lastDiff = diffs[diffs.length - 1]
          markLines.unshift('...')
          for (let lineIndex = lastDiff.markLines.length - 1; lineIndex >= 0; lineIndex--) {
            markLines.unshift(lastDiff.markLines[lineIndex])
          }
        }
        // 合并省略号
        markLines = this.#mergeEllipsis(markLines)
        diffs.push({
          markLines,
          newLines: lines.filter(line => line.startsWith('+')).map(item => item.substring(1)),
          dropLines: lines.filter(line => line.startsWith('-')).map(item => item.substring(1))
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
    let endIndex = -1
    const firstMarkLine = markLines[0]
    // 如果标记行为start，则视为直接添加到内容最顶部
    if (firstMarkLine === 'start') {
      return 0
    }
    // 如果标记行为end，则视为直接添加到内容最底部
    if (firstMarkLine === 'end') {
      return contentLines.length
    }
    for (let i = searchIndex; i < contentLines.length; i++) {
      const contentLine = contentLines[i]
      if (contentLine === firstMarkLine) {
        startIndex = endIndex = i
        break
      }
    }
    // 没有获取到首行坐标，则认为表达式没有查询到对应目标
    if (startIndex === -1) {
      return null
    }
    // 从第二行标记行开始，继续在内容行中查找
    for (let i = 1; i < markLines.length; i++) {
      const markLine = markLines[i]
      if (markLine === '...') {
        // 记录检索范围
        continue
      }
      // 在检索范围内查找内容行，如果发现内容行等于标记行，则记录结束索引
      for (let j = startIndex + 1; j < contentLines.length; j++) {
        const contentLine = contentLines[j]
        if (contentLine === markLine) {
          endIndex = j
          break
        }
      }
      // 如果不存在结束索引，说明后面的标记行无法得到满足，此时需要重新进行检索
      if (endIndex === -1) {
        // 无法完全匹配，则调整检索索引并重新检索
        return this.getInsertIndex(contentLines, markLines, startIndex+1)
      }
    }
    return endIndex + 1
  }
}
module.exports = new EllipsisExpress()
