const ellipsis = require('./ellipsis')
const fs = require('../core/utils/fs')

const express = fs.readFile('H:\\goldpankit\\kit-node-cli-ui\\node-service\\test\\express.txt').content
const content = fs.readFile('H:\\goldpankit\\kit-node-cli-ui\\node-service\\test\\content.txt').content
const mergedContent = ellipsis.merge(express, content)
// fs.createFile(
//     'H:\\goldpankit\\kit-node-cli-ui\\node-service\\test\\output.txt',
//     mergedContent,
//     true
// )