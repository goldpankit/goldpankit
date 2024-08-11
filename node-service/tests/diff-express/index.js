const diffExpress = require('../../core/utils/diff-express')
const fs = require('../../core/utils/fs')
const root = process.cwd()
const sourceFileContent = fs.readFile(`${root}/source.txt`).content
const expressFileContent = fs.readFile(`${root}/express.txt`).content
console.log(diffExpress.merge(expressFileContent, sourceFileContent))
// console.log(diffExpress.revertMerge(expressFileContent, sourceFileContent))
