const serviceConf = require('./service.config')
const serviceFile = require('./service.file')
const fs = require("./utils/fs");
const path = require('path')

class Translator {
    constructor() {
    }

    /**
     * 根据翻译器配置翻译空间代码
     * dto = {
     *   space: '',
     *   service: ''
     * }
     */
    translate (dto) {
        // 获取服务配置
        const serviceConfig = serviceConf.getServiceConfig(dto)
        // 获取翻译器配置
        if (serviceConfig.translator == null || serviceConfig.translator.settings.length === 0) {
            return
        }
        const translators = serviceConfig.translator.settings
        const targetDirectory = path.join(serviceConfig.codespace, serviceConfig.translator.output)
        const files = fs.getFilesWithChildren(serviceConfig.codespace)
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
            let relativePath = absolutePath.replace(serviceConfig.codespace, '')
            if (relativePath.startsWith('/')) {
                relativePath = relativePath.substring(1)
            }
            // 翻译路径
            // 服务空间相对路径为xxx-vue的翻译空间相对路径可能为${path}-vue，此处需要获取翻译空间相对路径，
            // 获取配置信息时需要根据翻译相对路径来获取，因为在进行服务文件配置时，配置的是翻译后的文件路径
            // 在翻译路径时，构建虚拟文件，content设置为空，文件设置给定一个空对象（减少使用方的判断）
            let translateFilepathFile = {
                filepath: relativePath
            }
            let translatedFilepath = this.#translate(translators, translateFilepathFile, {}).filepath
            // 根据翻译路径获取文件设置
            const fileSetting = serviceFile.getFileSetting(serviceConfig.codespace, translatedFilepath)
            // 修改文件编译器设置为真实编译器
            fileSetting.compiler = fileSetting._actualCompiler
            delete fileSetting._actualCompiler
            // 翻译文件内容
            let translateContentFile = {
                filepath: relativePath,
                content: fileInfo.content
            }
            let translatedContent = ''
            // 文本文件进行翻译
            if (fileInfo.encode === 'utf-8') {
                translatedContent = this.#translate(translators, translateContentFile, fileSetting).content
            }
            // 二进制文件不做翻译，将其转为Buffer对象
            else {
                translatedContent = Buffer.from(translateContentFile.content, 'base64')
            }
            // 写入翻译文件
            fs.createFile(path.join(targetDirectory, translatedFilepath), translatedContent, true)
            // 翻译配置路径（用户可能先定义变量再执行翻译，此时需要将配置的path修改为翻译后的path）
            // TODO
        }
    }

    // 根据翻译器列表对文件进行翻译
    #translate (translators, file, fileSetting) {
        let relativePath = file.filepath
        for (const translator of translators) {
            // 不满足翻译器路径的直接跳过
            if (!new RegExp(translator.path).test(relativePath)) {
                continue
            }
            // 正则翻译
            if (translator.type === 'pattern') {
                file = this.#translateByPattern(file.filepath, file.content, translator)
            }
            // 自定义代码翻译
            else if (translator.type === 'code') {
                file = this.#translateByCode(file.filepath, file.content, fileSetting, translator.code)
                if (file == null || (file.filepath == null && file.content == null)) {
                    throw new Error('translator must return filepath and content like return { filepath, content }.')
                }
            }
        }
        return file
    }

    /**
     * 根据代码翻译
     * 注意：此处使用eval实现，在翻译器自定义代码中可访问以下参数
     * @param filepath 当前翻译的文件相对路径（相对服务空间）
     * @param content 当前翻译的文件内容
     * @param fileSetting 文件设置
     * @param code 翻译器代码
     */
    #translateByCode(filepath, content, fileSetting, code) {
        return eval(`(function translate() {
          ${code}
        })()`)
    }

    // 根据正则表达式翻译
    #translateByPattern (filepath, content, translator) {
        if (filepath != null && filepath !== '') {
            filepath = filepath.replace(new RegExp(translator.source, 'g'), translator.target)
        }
        if (content != null && content !== '') {
            content = content.replace(new RegExp(translator.source, 'g'), translator.target)
        }
        return {
            filepath, content
        }
    }
}
module.exports = new Translator()
