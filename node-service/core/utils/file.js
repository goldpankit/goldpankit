const fs = require('fs')
const path = require('path')
const root = process.cwd()
const Const = require('../constants/constants')
const cache = require('./cache')
module.exports = {
    __getFullFilepath (filepath) {
        return cache.get('SERVICE_ROOT') + '/' + filepath
    },
    getRoot() {
        return root
    },
    // 获取指定目录下的文件
    getFiles(absolutePath, ignore=true) {
        let filePool = [];
        const files = fs.readdirSync(absolutePath);
        // rootdir用于递归时拼接根结点，否则多级目录下将出现重复目录
        files.forEach(file => {
            // 忽略文件
            if (ignore && Const.IGNORE_DIRS.findIndex(f => file === f || file.startsWith(`${f}/`)) !== -1) {
                return
            }
            // 全路径
            const fullpath = path.join(absolutePath, file)
            // 相对路径
            const relativePath = this.getRelativePath(fullpath)
            filePool.push(relativePath);
            if (this.isDirectory(relativePath)) {
                const subfiles = this.getFiles(fullpath, ignore);
                filePool = filePool.concat(subfiles);
            }
        });
        return filePool
    },
    isDirectory (filepath) {
        return fs.statSync(this.__getFullFilepath(filepath)).isDirectory()
    },
    isFile (filepath) {
        return fs.statSync(this.__getFullFilepath(filepath)).isFile()
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
