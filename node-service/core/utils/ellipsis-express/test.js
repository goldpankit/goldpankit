const fs = require('../fs')
const ellipsis = require('../ellipsis-express.js')
const targetContent = fs.readFile('D:\\caesar\\goldpankit\\kit-node-cli-ui\\node-service\\core\\utils\\ellipsis-express\\old.java').content
const express = fs.readFile('D:\\caesar\\goldpankit\\kit-node-cli-ui\\node-service\\core\\utils\\ellipsis-express\\express.java').content
fs.createFile('D:\\caesar\\goldpankit\\kit-node-cli-ui\\node-service\\core\\utils\\ellipsis-express\\new.java',ellipsis.merge(express, targetContent),true)
