const serviceConf = require('./service.config')
const fs = require("./utils/fs");
const path = require('path')
const ignore = require("ignore");

class Translator {
    constructor() {
    }

    /**
     * 根据翻译器配置翻译代码
     * dto = {
     *   space: '',
     *   service: '',
     *   plugin: ''
     * }
     */
    translate (dto) {
        // 获取服务配置
        const serviceConfig = serviceConf.getServiceConfig(dto)
        if (serviceConfig.translator == null) {
            return
        }
        // 获取翻译器代码
        const hasFilepathTranslator = serviceConfig.translator.filepath != null && serviceConfig.translator.filepath.trim() !== ''
        const hasContentTranslator = serviceConfig.translator.content != null && serviceConfig.translator.content.trim() !== ''
        if (!hasFilepathTranslator && !hasContentTranslator) {
            return
        }
        let filepathTranslateCode = hasFilepathTranslator ? serviceConfig.translator.filepath : ''
        let contentTranslateCode = hasContentTranslator ? serviceConfig.translator.content : ''
        const targetDirectory = path.join(serviceConfig.codespace, serviceConfig.translator.output)
        const ignoreInstance = ignore().add(fs.getIgnoreFileConfig(serviceConfig.codespace))
        const files = fs.getFilesWithChildren(serviceConfig.codespace, ignoreInstance)
        // 删除已翻译目录
        fs.deleteDirectory(targetDirectory, true)
        // 循环文件逐个翻译
        for (const absolutePath of files) {
            // 目录，直接跳过
            if (fs.isDirectory(absolutePath)) {
                continue
            }
            const fileInfo = fs.readFile(absolutePath)
            // 服务空间相对路径
            let relativePath = fs.getRelativePath(absolutePath, serviceConfig.codespace)
            // 翻译路径
            let translatedFilepath = relativePath
            if (hasFilepathTranslator) {
                translatedFilepath = this.#translateFilepath(filepathTranslateCode, relativePath)
            }
            // 翻译文件内容
            let translatedContent = fileInfo.content
            // 文本文件进行翻译
            if (fileInfo.encode === 'utf-8') {
                if (hasContentTranslator) {
                    translatedContent = this.#translateContent(contentTranslateCode, relativePath, fileInfo.content)
                }
            }
            // 二进制文件不做翻译，将其转为Buffer对象
            else {
                translatedContent = Buffer.from(fileInfo.content, 'base64')
            }
            // 写入翻译文件
            fs.createFile(path.join(targetDirectory, translatedFilepath), translatedContent, true)
            // 翻译配置路径（用户可能先定义变量再执行翻译，此时需要将配置的path修改为翻译后的path）
            // TODO
        }
    }

    // 翻译路径
    #translateFilepath (translateCode, filepath) {
        // 获取文件名称
        const filename = fs.getFilename(filepath)
        // 获取文件后缀
        let suffix = null
        let lastPointIndex = filename.lastIndexOf('.')
        if (lastPointIndex !== -1) {
            suffix = filename.substring(lastPointIndex + 1)
        }
        // 文件名为.开头，视为后缀为null
        if (filename.lastIndexOf('.') === filename.indexOf('.')) {
            suffix = null
        }
        const newFilepath = new Function(`return (function ({ filepath, filename, suffix }) {
          ${translateCode}
        })`)()({ filepath, filename, suffix })
        if (newFilepath == null || typeof newFilepath !== 'string' || newFilepath.trim() === '') {
            throw new Error('文件路径翻译失败，函数返回值必须为一个非空字符串')
        }
        return newFilepath
    }

    // 翻译路径
    #translateContent (translateCode, filepath, content) {
        // 获取文件名称
        const filename = fs.getFilename(filepath)
        // 获取文件后缀
        let suffix = null
        let lastPointIndex = filename.lastIndexOf('.')
        if (lastPointIndex !== -1) {
            suffix = filename.substring(lastPointIndex + 1)
        }
        // 文件名为.开头，视为后缀为null
        if (filename.lastIndexOf('.') === filename.indexOf('.')) {
            suffix = null
        }
        const newContent = new Function(`return (function ({ filepath, filename, suffix, content }) {
          ${translateCode}
        })`)()({ filepath, filename, suffix, content })
        if (newContent == null || typeof newContent !== 'string') {
            throw new Error('文件内容翻译失败，函数返回值必须为一个字符串')
        }
        return newContent
    }
}
module.exports = new Translator()
