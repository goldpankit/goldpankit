<template>
  <div class="directory-select">
    <div class="header">
      <h4>{{ title == null ? $t('component.selectDirectory') : title }}</h4>
      <div class="opera">
        <el-button icon="Refresh" @click="__fetchFiles(paths)">{{$t('common.refresh')}}</el-button>
        <el-button icon="Plus" @click="createDirectory">{{$t('component.createNewFolder')}}</el-button>
      </div>
    </div>
    <div v-if="initData.isNotExists" class="error-tip">
      <el-icon><WarningFilled /></el-icon>
      <p>{{$t('component.pathNotExistsTip', { path: initData.selectedFilepath })}}</p>
    </div>
    <ul class="paths">
      <li
        v-for="(path,index) in paths"
        :key="path"
        @click="changePath(index)"
      >
        <span>{{ path }}</span>
        <em v-if="index < paths.length - 1">{{separator}}</em>
      </li>
    </ul>
    <div class="files">
      <ul>
        <li
          v-for="(file,index) in files"
          :key="file.id"
          :class="{ 'is-file': file.type !== 'DIRECTORY', selected: selectedFilepath === file.path }"
          @click="select(file)"
          @dblclick="fetchSubFiles(file)"
        >
          <template v-if="file.__creating">
            <div class="new-directory" @click.stop>
              <div class="wrap">
                <el-input
                  :ref="`input_${file.id}`"
                  v-model="file.path"
                  placeholder="unknown directory"
                  @input="checkFilename(file)"
                />
                <el-button type="primary" class="button-icon" icon="Select" :disabled="!file.__creatable || file.__working_create" @click="confirmCreateDirectory(file)"></el-button>
                <el-button icon="Close" class="button-icon" @click="cancelCreateDirectory(index)"></el-button>
              </div>
              <p v-if="!file.__creatable">
                {{file.__check_message}}
              </p>
            </div>
          </template>
          <template v-else>
            <el-icon>
              <Folder v-if="file.type === 'DIRECTORY'"/>
              <Document v-else-if="file.type === 'FILE'"/>
              <QuestionFilled v-else/>
            </el-icon>
            <p>{{ file.path }}</p>
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import path from "../../utils/path"
import {fetchFiles, fetchRuntimeRoot, createDirectory} from "../../api/local.file";
import {sortFiles} from "../../utils/file";
import { generateId } from '../../utils/generator'

export default {
  name: "DirectorySelect",
  props: {
    modelValue: {},
    title: {
      require: false
    },
    // 选择类型
    type: {
      default: 'DIR'
    }
  },
  data () {
    return {
      isWindows: path.getOS() === 'windows',
      paths: [],
      files: [],
      // 初始化数据，例如编辑项目时当前项目的路径，当前项目路径是否存在等，用于给予用户路径不存在提醒
      initData: {
        selectedFilepath: null,
        isNotExists: false
      },
      selectedFilepath: null
    }
  },
  computed: {
    separator () {
      if (this.isWindows) {
        return '\\'
      }
      return '/'
    }
  },
  watch: {
    selectedFilepath () {
      if (this.selectedFilepath == null) {
        this.$emit('update:modelValue', '')
        this.$emit('change', '')
      }
    }
  },
  methods: {
    // 选择目录
    select (file) {
      if (file.__creating || file.type !== 'DIRECTORY') {
        return
      }
      if (this.selectedFilepath === file.path) {
        return
      }
      this.selectedFilepath = file.path
      const paths = JSON.parse(JSON.stringify(this.paths))
      paths.push(this.selectedFilepath)
      this.$emit('update:modelValue', this.__getAbsolutePath(paths))
      this.$emit('change', this.__getAbsolutePath(paths))
    },
    // 检查目录名称
    checkFilename (file) {
      if (this.files.filter(f => f.path === file.path).length > 1) {
        file.__check_message = this.$t('component.dirExistsTip')
        file.__creatable = false
        return
      }
      file.__check_message = ''
      file.__creatable = true
    },
    // 添加目录
    createDirectory () {
      const fileId = `file_${generateId()}`
      this.files.push({
        id: fileId,
        path: '',
        type: 'DIRECTORY',
        __creatable: false,
        __working_create: false,
        __creating: true,
        __check_message: ''
      })
      sortFiles(this.files)
      this.$nextTick(() => {
        this.$refs[`input_${fileId}`] &&
          this.$refs[`input_${fileId}`][0] &&
            this.$refs[`input_${fileId}`][0].focus()
      })
    },
    // 确认添加
    confirmCreateDirectory (file) {
      if (file.__working_create) {
        return
      }
      file.__working_create = true
      const paths = JSON.parse(JSON.stringify(this.paths))
      paths.push(file.path)
      createDirectory(this.__getAbsolutePath(paths))
        .then(() => {
          file.__creating = false
          sortFiles(this.files)
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
        .finally(() => {
          file.__working_create = false
        })
    },
    // 取消添加
    cancelCreateDirectory (index) {
      this.files.splice(index, 1)
    },
    // 修改路径
    changePath (index) {
      if (index === this.paths.length - 1) {
        return
      }
      this.selectedFilepath = null
      const paths = this.paths.slice(0, index + 1)
      this.__fetchFiles(paths, () => {
        this.paths.splice(index + 1)
      })
    },
    // 查看子目录
    fetchSubFiles (file) {
      if (file.__creating) {
        return
      }
      if (file.type !== 'DIRECTORY') {
        return
      }
      const paths = JSON.parse(JSON.stringify(this.paths))
      paths.push(file.path)
      this.__fetchFiles(paths, () => {
        this.selectedFilepath = null
        this.paths.push(file.path)
      })
    },
    // 获取文件列表
    __fetchFiles (paths, callback) {
      fetchFiles(this.__getAbsolutePath(paths))
        .then(data => {
          this.files = data.map(f => {
            return {
              ...f,
              id: `file_${generateId()}`
            }
          })
          sortFiles(this.files)
          callback && callback(this.files)
        })
        .catch(e => {
          // 目录不存在
          if (e.code === 'ENOENT') {
            this.initData.isNotExists = true
            this.__fetchDefaultPaths()
            return
          }
          this.$tip.apiFailed(e)
        })
    },
    // 获取路径
    __fetchDefaultPaths () {
      fetchRuntimeRoot()
        .then(data => {
          this.paths = path.split(data).filter(item => item !== '')
          this.__fetchFiles()
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 获取绝对路径
    __getAbsolutePath (paths) {
      if (paths == null) {
        paths = this.paths
      }
      return path.join(paths)
    }
  },
  mounted () {
    // 新建
    if (this.modelValue == null || this.modelValue === '') {
      this.__fetchDefaultPaths()
      return
    }
    // 编辑
    this.initData.selectedFilepath = this.modelValue
    this.paths = path.split(this.modelValue).filter(item => item !== '')
    this.selectedFilepath = this.paths.pop()
    this.__fetchFiles(this.paths, files => {
      // 查看初始化路径是否存在
      this.initData.isNotExists = files.find(f => f.path === this.selectedFilepath) == null
    })
  }
}
</script>

<style scoped lang="scss">
.directory-select {
  text-align: initial;
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: var(--form-shadow);
  border-radius: var(--radius-page);
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border-default-color);
    padding-bottom: 15px;
    h4 {
      flex-shrink: 0;
      font-size: var(--font-size-middle);
    }
    .opera {
      flex-shrink: 0;
    }
  }
  .error-tip {
    background: rgba(255, 0, 0, .1);
    padding: 5px 20px;
    display: flex;
    align-items: center;
    line-height: 15px;
    .el-icon {
      margin-right: 5px;
      color: var(--color-danger);
    }
  }
  .paths {
    flex-shrink: 0;
    display: flex;
    flex-wrap: wrap;
    padding: 10px 0 5px 0;
    border-bottom: 1px solid var(--border-default-color);
    li {
      position: relative;
      margin-bottom: 5px;
      line-height: 20px;
      span {
        background: var(--background-color);
        padding: 5px 8px;
        border-radius: 5px;
        transition: all ease .15s;
        cursor: pointer;
      }
      em {
        font-style: normal;
        margin: 0 5px;
        color: var(--color-gray-1);
      }
      &:hover {
        span {
          color: var(--primary-color-match-2);
        }
      }
    }
  }
  .files {
    flex-grow: 1;
    background: var(--color-light);
    height: 150px;
    display: flex;
    flex-direction: column;
    ul {
      overflow-y: auto;
      display: flex;
      flex-wrap: wrap;
      li {
        width: 50%;
        padding: 5px 10px;
        line-height: 40px;
        border-bottom: 1px dashed var(--border-default-color);
        cursor: pointer;
        display: flex;
        align-items: center;
        &.is-file {
          color: var(--color-gray-1);
          cursor: default;
          &:hover {
            color: var(--color-gray-1);
          }
        }
        &.selected {
          background: var(--primary-color-match-2);
          color: var(--color-light);
          border-bottom: 0;
          &:hover {
            background: var(--primary-color-match-2);
            color: var(--color-light);
          }
        }
        &:last-of-type {
          border-bottom: 0;
        }
        &:hover {
          color: var(--primary-color-match-2);
        }
        .el-icon {
          margin-right: 10px;
        }
        p {
          line-height: initial;
          word-break: break-all;
        }
        // 创建目录
        .new-directory {
          width: 100%;
          .wrap {
            display: flex;
            .el-input {
              flex-grow: 1;
            }
            .el-button {
              flex-shrink: 0;
              margin-left: 10px;
            }
          }
          & > p {
            color: var(--color-danger);
            font-size: var(--font-size-mini);
          }
        }
      }
    }
  }
}
</style>
