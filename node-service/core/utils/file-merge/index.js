const fs = require('../fs')
const newFilePath = '/Users/caesar/adjustrd/goldpankit/codespace/kit-node-cli-ui/node-service/core/utils/file-merge/new-main.js'
const oldFilePath = '/Users/caesar/adjustrd/goldpankit/codespace/kit-node-cli-ui/node-service/core/utils/file-merge/main.js'

const newFileContent = fs.readFile(newFilePath)
const oldFileContent = fs.readFile(oldFilePath)

const expresses = newFileContent.split('/...').filter(content => content.trim().endsWith('.../'))
const diffs = []
for (let express of expresses) {
  express = express.substring(0, express.indexOf('.../'))
  express = express.trim()
  const subExpresses = express.split('...')
  for (let i in subExpresses) {
    i = parseInt(i)
    const subExp = subExpresses[i]
    const lines = subExp.split('\n').filter(line => line !== '')
    let markLines = lines.filter(line => !line.startsWith('+') && !line.startsWith('-'))
    // 后面的标记行，要添加前面的标记行
    if (i > 0) {
      const lastDiff = diffs[diffs.length - 1]
      markLines.unshift('...')
      for (let lineIndex = lastDiff.markLines.length - 1; lineIndex >= 0; lineIndex--) {
        markLines.unshift(lastDiff.markLines[lineIndex])
      }
    }
    diffs.push({
      markLines,
      addLines: lines.filter(line => line.startsWith('+')).map(item => item.substring(1)),
      subLines: lines.filter(line => line.startsWith('-')).map(item => item.substring(1))
    })
  }
}
// 根据diffs合并
const mergeContent = oldFileContent
const mergeContentLines = mergeContent.split('\n')
for (const diff of diffs) {
  const markLines = diff.markLines
  // 找到开始位置
  const positionInfo = getDiffStartIndex(mergeContentLines, markLines)
  // console.log('位置信息', positionInfo)
  // 处理删除行
  // 处理添加行
  if (positionInfo != null) {
    // 在范围结束位置插入要添加的行
    mergeContentLines.splice(positionInfo.markEndIndex + 1, 0, ...diff.addLines)
  }
}
console.log(mergeContentLines.join('\n'))

function getDiffStartIndex (contentLines, markLines, searchIndex = 0) {
  // 找到匹配的第一行坐标
  let startIndex = -1
  let endIndex = -1
  const firstMarkLine = markLines[0]
  // 如果标记行为start，则视为直接添加到内容最顶部
  if (firstMarkLine === 'start') {
    return {
      markStartIndex: -1,
      markEndIndex: -1
    }
  }
  // 如果标记行为end，则视为直接添加到内容最底部
  if (firstMarkLine === 'end') {
    return {
      markStartIndex: contentLines.length - 1,
      markEndIndex: contentLines.length - 1
    }
  }
  for (let i = searchIndex; i < mergeContentLines.length; i++) {
    const contentLine = mergeContentLines[i]
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
    for (let j = startIndex + 1; j < mergeContentLines.length; j++) {
      const contentLine = mergeContentLines[j]
      if (contentLine === markLine) {
        endIndex = j
        break
      }
    }
    // 如果不存在结束索引，说明后面的标记行无法得到满足，此时需要重新进行检索
    if (endIndex === -1) {
      // 无法完全匹配，则调整检索索引并重新检索
      return getDiffStartIndex(contentLines, markLines, startIndex+1)
    }
  }
  return {
    markStartIndex: startIndex,
    markEndIndex: endIndex
  }
}
// console.log(diffs)
