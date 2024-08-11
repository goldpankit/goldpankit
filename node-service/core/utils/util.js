module.exports = {
  /**
   * 判断lines是否连续存在于totalLines中
   * @param lines
   * @param totalLines
   */
  containsLines(lines, totalLines) {
    if (lines.length === 0) {
      return true
    }
    if (lines.length > totalLines.length) {
      return false
    }
    if (lines.length === 1) {
      return totalLines.includes(lines[0])
    }
    if (lines.length === totalLines.length) {
      return lines.join('\n') === totalLines.join('\n')
    }
    return totalLines.join('\n').indexOf(lines.join('\n')) !== -1
  }
}
