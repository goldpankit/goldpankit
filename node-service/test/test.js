const ellipsis = require('./ellipsis')
const fs = require('../core/utils/fs')

const express = fs.readFile('D:\\caesar\\goldpankit\\kit-node-cli-ui\\node-service\\test\\express.txt').content
const content = fs.readFile('D:\\caesar\\goldpankit\\kit-node-cli-ui\\node-service\\test\\content.txt').content
const mergedContent = ellipsis.merge(express, content)
const unmergedContent = ellipsis.revertMerge(express, mergedContent)
fs.createFile(
    'D:\\caesar\\goldpankit\\kit-node-cli-ui\\node-service\\test\\output.txt',
  unmergedContent,
    true
)
