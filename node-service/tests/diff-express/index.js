const diffExpress = require('../../core/utils/diff-express')
const fs = require('../../core/utils/fs')
const util = require("../../core/utils/util");
const root = process.cwd()
const sourceFileContent = fs.readFile(`${root}/source.txt`).content
const expressFileContent = fs.readFile(`${root}/express.txt`).content

// 合并测试
const mergeResult = diffExpress.merge(expressFileContent, sourceFileContent)
console.log(mergeResult.success, mergeResult.message, mergeResult.content)

// 反向合并测试
// const revertResult = diffExpress.revertMerge(expressFileContent, sourceFileContent)
// console.log(revertResult.success, revertResult.message, revertResult.content)

function test_getFirstLineIndex () {
  const util = require('../../core/utils/util')
  console.log(util.getFirstLineIndex(
    ['删除行1', '删除行2'],
    ['删除行1', '删除行2', '删除行1', '删除行2', '定位行1', '删除行1', '删除行2', '删除行1', '删除行2'],
    4,
    1)
  )
  console.log(util.getFirstLineIndex(
    ['删除行1', '删除行2', '删除行3'],
    ['删除行1', '删除行2', '删除行3', '删除行1', '删除行2', '删除行3', '定位行1', '删除行1', '删除行2', '删除行3', '删除行1', '删除行2', '删除行3'],
    6,
    -1)
  )
}
// test_getFirstLineIndex()
