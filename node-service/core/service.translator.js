const service = require('./service')
const cache = require('./utils/cache')
module.exports = {
    // 根据翻译器配置翻译空间代码
    translate (dto) {
        // 获取服务文件
        const serviceConfig = service.getServiceConfig(dto)
        // 获取翻译器配置
        let translator = serviceConfig.translator
        if (translator == null || translator.settings.length === 0) {
            return
        }
        // // 获取文件
        // const files = FileUtil.getFiles(FileUtil.getRoot())
        // const deletedDirs = new Set()
        // for (const file of files) {
        //     if (FileUtil.isDirectory(file)) {
        //         continue
        //     }
        //     let content = FileUtil.readFile(file)
        //     let newContent = content
        //     let newFilepath = file
        //     // 执行翻译
        //     for (const config of translator) {
        //         newContent = content.replace(new RegExp(config.source, 'g'), config.target)
        //         newFilepath = file.replace(new RegExp(config.source, 'g'), config.target)
        //     }
        //     if (newContent.length !== content.length || newFilepath.length !== file.length) {
        //         // 如果路径发生了变化
        //         if (newFilepath.length !== file.length) {
        //             // 添加文件目录到要删除的目录集中
        //             deletedDirs.add(FileUtil.getDirectory(file))
        //             // 创建新文件
        //             FileUtil.createFile(newFilepath, newContent, true)
        //             // 创建新文件配置
        //             let config = fileConfig.getFileConfigJSON(file)
        //             if (config == null) {
        //                 config = { compiler: 'freemarker' }
        //             }
        //             fileConfig.createConfigFile(newFilepath, config)
        //             // 删除原有文件配置
        //             fileConfig.logicDelete(file)
        //             // 删除原有文件
        //             FileUtil.deleteFile(file)
        //             continue
        //         }
        //         // 只是内容发生了变化，直接修改文件编译模式为freemarker即可
        //         fileConfig.rewrite(file, { compiler: 'freemarker' })
        //     }
        // }
        //
        // // 删除需要被删除的目录
        // const root = FileUtil.getRoot()
        // for (const deletedDir of deletedDirs) {
        //     if (deletedDir === root) {
        //         continue
        //     }
        //     // 删除配置目录
        //     console.log('删除配置目录', Const.CONFIG_DIR + '/' + deletedDir)
        //     FileUtil.deleteDirectory(Const.CONFIG_DIR + '/' + deletedDir, true)
        //     FileUtil.deleteFile(fileConfig.getConfigFilePath(deletedDir))
        //     // 删除模版文件目录
        //     FileUtil.deleteDirectory(deletedDir, true)
        // }
        //
        // // 执行build
        // build.exec(false)
    }
}
