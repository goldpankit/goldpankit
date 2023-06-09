const service = require('./service')
const fs = require("./utils/fs");
module.exports = {
    /**
     * 根据翻译器配置翻译空间代码
     * dto = {
     *   space: '',
     *   service: ''
     * }
     */
    translate (dto) {
        // 获取服务配置
        const serviceConfig = service.getServiceConfig(dto)
        // 获取翻译器配置
        if (serviceConfig.translator == null || serviceConfig.translator.settings.length === 0) {
            return
        }
        const translators = serviceConfig.translator.settings
        const targetDirectory = `${serviceConfig.codespace}/${serviceConfig.translator.output}`
        const files = fs.getFilesWithChildren(serviceConfig.codespace)
        // 删除已翻译目录
        fs.deleteDirectory(targetDirectory, true)
        for (const absolutePath of files) {
            const relativePath = absolutePath.replace(serviceConfig.codespace + '/', '')
            // 目录，直接跳过
            if (fs.isDirectory(absolutePath)) {
                continue
            }
            // 执行翻译
            let newContent = fs.readFile(absolutePath)
            let newFilepath = relativePath
            for (const translator of translators) {
                console.log(translator.source, translator.target)
                // 不满足翻译器路径的直接跳过
                if (!new RegExp(translator.path).test(relativePath)) {
                    continue
                }
                newContent = newContent.replace(new RegExp(translator.source, 'g'), translator.target)
                newFilepath = newFilepath.replace(new RegExp(translator.source, 'g'), translator.target)
            }
            // 写入翻译文件
            newFilepath = `${targetDirectory}/${newFilepath}`
            fs.createFile(newFilepath, newContent, true)
            // 翻译配置
            // TODO
        }
    }
}
