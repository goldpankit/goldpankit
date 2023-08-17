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
    constructor(lineIndex, content, operaType) {
        this.lineIndex = lineIndex
        this.content = content
        this.operaType = operaType
    }
}

/**
 * 差异组，一个表达式由若干个差异组组成，组中包含差异行记录
 */
class DiffGroup {
    // 差异行，最后的差异行在最顶部
    diffLines;
    // 表达式行
    expressLines;
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
        const diffGroups = this.getDiffGroups(express, content)
    }

    /**
     * 获取差异组
     */
    getDiffGroups (express, content) {
        // 去掉首尾
        const totalExpressLines = express.split('\r\n')
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
        for (const expressGroup of expressLinesGroup) {
            console.log(this.getDiffGroup(expressGroup, content))
        }
        return expressLinesGroup
    }

    /**
     * 为表达式组获取差异组对象
     * @param expressLines 表达式行数组
     * @param content 内容
     */
    getDiffGroup (expressLines, content) {
        const contentLines = content.split('\r\n')
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
                    line,
                    index
                })
            }
        }
        // 构建差异行
        for (const line of expressLines) {

        }
        return positionLines
    }

    /**
     * 获取行索引
     * @param targetLine 目标行内容
     * @param contentLines 目标内容行数组
     * @param searchStartIndex 开始搜索位置
     * @returns {number}
     */
    #getLineIndex(targetLine, contentLines, searchStartIndex = 0) {
        for (let i = searchStartIndex; i < contentLines.length; i++) {
            if (contentLines[i] != null && targetLine.trim() === contentLines[i].trim()) {
                return i
            }
        }
        return -1
    }

}

module.exports = new EllipsisExpress()