const fs = require('../fs')
const ee = require('../ellipsis-express')
const newFilePath = '/Users/caesar/adjustrd/goldpankit/codespace/kit-node-cli-ui/node-service/core/utils/file-merge/new-main.js'
const oldFilePath = '/Users/caesar/adjustrd/goldpankit/codespace/kit-node-cli-ui/node-service/core/utils/file-merge/main.js'
const mergeFile = '/Users/caesar/adjustrd/goldpankit/codespace/kit-node-cli-ui/node-service/core/utils/file-merge/merge-main.js'

const newFileContent = fs.readFile(newFilePath)
const oldFileContent = fs.readFile(oldFilePath)

const mergeContent = ee.merge(newFileContent, oldFileContent)
fs.rewrite(mergeFile, mergeContent)