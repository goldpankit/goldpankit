const fs = require('fs')
const path = require('path')
const Const = require('./constants/constants')
const cache = require('./utils/cache')
const file = require('./service.file')
module.exports = {
    __getFullFilepath (filepath) {
        return this.getRoot() + '/' + filepath
    },
    getRoot() {
        const root = cache.get('SERVICE_ROOT')
        if (root == null) {
            throw new Error('can not found root directory.')
        }
        return root
    },
    // 获取服务文件列表
    getFiles(serviceId) {
        const service = cache.services.get(serviceId)
        return file.getFiles(service.dir)
    },
    // 获取服务文件树
    getFileTree(serviceId) {
        const service = cache.services.get(serviceId)
        return file.getFileTree(service.dir)
    },
    readFile (filepath) {
        return fs.readFileSync(this.__getFullFilepath(filepath)).toString()
    },
    createDirectory (filepath, force = false) {
        if (force) {
            this.deleteDirectory(filepath, force)
        }
        if (!this.exists(filepath)) {
            fs.mkdirSync(this.__getFullFilepath(filepath), { recursive: true })
        }
    },
    getDirectory (filepath) {
        if (filepath.indexOf('/') !== -1) {
            const paths = filepath.split('/')
            paths.pop()
            return paths.join('/')
        }
        return filepath
    },
    deleteDirectory (filepath, force = false) {
        if (this.exists(filepath)) {
            fs.rmdirSync(this.__getFullFilepath(filepath), {
                recursive: force
            })
        }
    },
    deleteFile (filepath) {
        if (this.exists(filepath)) {
            fs.unlinkSync(this.__getFullFilepath(filepath))
        }
    },
    createFile (filepath, content, force = false) {
        if (force) {
            this.deleteFile(filepath)
            // 获取文件所在目录，如果目录不存在，则创建目录
            const directory = this.getDirectory(filepath)
            if (!this.exists(directory)) {
                this.createDirectory(directory)
            }
        }
        fs.writeFileSync(this.__getFullFilepath(filepath), content)
    },
    createFileByAbsolutePath (filepath, content, force = false) {
        if (force && fs.existsSync(filepath)) {
            fs.unlinkSync(filepath)
        }
        const directory = this.getDirectory(filepath)
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true })
        }
        fs.writeFileSync(filepath, content)
    },
    exists (filepath) {
        return fs.existsSync(this.__getFullFilepath(filepath))
    },
    isEmptyDirectory (filepath) {
        return fs.readdirSync(this.__getFullFilepath(filepath)).length === 0
    },
    getRelativePath (filepath) {
        return filepath.replace(this.getRoot() + '/', '')
    },
    getFilename (filepath) {
        if (filepath.indexOf('/') === -1) {
            return filepath
        }
        return filepath.split('/').pop()
    },
    getFiletype (filepath) {
        let filetype = this.getFilename(filepath)
        if (filetype.indexOf('.') !== -1) {
            filetype = `.${filetype.split('.').pop()}`
        }
        filetype = Const.FILE_TYPE_MAP[filetype.toLowerCase()]
        if (filetype == null) {
            return 'FILE'
        }
        return filetype
    }
}
