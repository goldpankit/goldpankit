<template>
  <div class="directory-select">
    <div class="header">
      <h4>{{ title == null ? $t('component.selectDirectory') : title }}</h4>
      <div class="opera">
        <el-button icon="Refresh" @click="__fetchFiles(paths)">{{$t('common.refresh')}}</el-button>
        <el-button icon="Plus" @click="createDirectory">{{$t('component.createNewFolder')}}</el-button>
      </div>
    </div>
    <div class="selected-tip">
      <label>{{$t('common.currentSelect')}}：</label>
      <p>{{selectedAbsolutePathLabel}}</p>
    </div>
    <div v-if="initData.isNotExists && initData.visibleError" class="error-tip">
      <el-icon><WarningFilled /></el-icon>
      <p>{{$t('component.pathNotExistsTip', { path: initData.selectedFilepath })}}</p>
      <span class="close-button" @click="initData.visibleError = false">
        <el-icon><CloseBold /></el-icon>
      </span>
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
    <div class="files" :style="{height: height}">
      <ul v-if="files.length > 0">
        <li
          v-for="(file,index) in files"
          :key="file.id"
          :class="{ 'is-file': file.type !== 'DIRECTORY', selected: selectedFile === file }"
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
                  @keypress.enter="confirmCreateDirectory(file)"
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
      <Empty v-else description="当前目录下无内容"/>
    </div>
  </div>
</template>

<script>
import path from "../../utils/path"
import {fetchFiles, fetchRuntimeRoot, createDirectory} from "../../api/local.file";
import {sortFiles} from "../../utils/file";
import { generateId } from '../../utils/generator'
import Empty from "./Empty.vue";

export default {
  name: "DirectorySelect",
  components: {Empty},
  props: {
    modelValue: {},
    title: {
      require: false
    },
    // 选择类型
    type: {
      default: 'DIR'
    },
    // 文件部分高度
    height: {
      default: '180px'
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
        isNotExists: false,
        visibleError: true
      },
      selectedFile: null
    }
  },
  computed: {
    separator () {
      if (this.isWindows) {
        return '\\'
      }
      return '/'
    },
    // 选中的绝对地址
    selectedAbsolutePath () {
      if (this.selectedFile == null) {
        return this.__getAbsolutePath()
      }
      const paths = JSON.parse(JSON.stringify(this.paths))
      paths.push(this.selectedFile.path)
      return this.__getAbsolutePath(paths)
    },
    // 选中的绝对地址，用于展示
    selectedAbsolutePathLabel () {
      let paths = JSON.parse(JSON.stringify(this.paths))
      if (this.selectedFile != null) {
        paths.push(this.selectedFile.path)
      }
      if (paths.length <= 7) {
        return path.join(paths)
      }
      let prefix = path.join(paths.slice(0, 3))
      if (path.getOS() !== 'windows') {
        prefix += '/'
      }
      let suffix = path.join(paths.slice(paths.length - 3), 3)
      if (path.getOS() === 'windows') {
        suffix = '\\' + suffix
      }
      return prefix + '...' + suffix
    }
  },
  watch: {
    selectedAbsolutePath (newValue, oldValue) {
      // 首次赋值
      if (oldValue === '\\' || oldValue === '/') {
        // 编辑，首次赋值时不触发change-project事件，避免直接修改项目名称
        if (this.initData.selectedFilepath != null) {
          this.$emit('update:modelValue', this.selectedAbsolutePath)
          this.$emit('change', this.selectedAbsolutePath)
          return
        }
      }
      // 其他情况，触发修改和变更事件
      this.$emit('update:modelValue', this.selectedAbsolutePath)
      this.$emit('change', this.selectedAbsolutePath)
      // 用于修改项目名称
      this.$emit('change-project', this.selectedAbsolutePath)
    }
  },
  methods: {
    // 选择目录
    select (file) {
      if (file.__creating || file.type !== 'DIRECTORY') {
        return
      }
      if (this.selectedFile === file.path) {
        return
      }
      this.selectedFile = file
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
      // 排序
      sortFiles(this.files)
      // 自动聚焦
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
          // 文件排序
          sortFiles(this.files)
          this.selectedFile = file
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
        this.selectedFile = null
        return
      }
      this.selectedFile = null
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
        this.selectedFile = null
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
    this.paths = path.split(this.modelValue)
    this.__fetchFiles(this.paths)
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
    padding-bottom: 15px;
    h4 {
      flex-shrink: 0;
      font-size: var(--font-size-middle);
    }
    .opera {
      flex-shrink: 0;
    }
  }
  .selected-tip {
    background: var(--background-color);
    padding: 5px 10px;
    display: flex;
    align-items: center;
    line-height: 15px;
    border: 1px solid var(--border-default-color);
    label {
      color: var(--color-gray);
      flex-shrink: 0;
    }
    p {
      flex-grow: 1;
      overflow: hidden;
      word-break: break-all;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .error-tip {
    background: rgba(255, 0, 0, .1);
    padding: 5px 20px;
    display: flex;
    align-items: center;
    line-height: 15px;
    font-size: var(--font-size-mini);
    & > p {
      flex-grow: 1;
      word-break: break-all;
    }
    & > .el-icon {
      flex-shrink: 0;
      margin-right: 5px;
      color: var(--color-danger);
    }
    & > .close-button {
      margin-left: 10px;
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, .15);
      transition: all ease .15s;
      &:hover {
        background: rgba(0, 0, 0, .3);
        color: var(--color-light);
        cursor: default;
      }
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
        padding: 2px 8px;
        border-radius: 5px;
        transition: all ease .15s;
        cursor: pointer;
        color: var(--color-service-name);
        font-weight: bold;
      }
      em {
        font-style: normal;
        margin: 0 5px;
        color: var(--color-gray-1);
      }
      &:hover {
        span {
          color: var(--color-service-name-hover);
        }
      }
    }
  }
  .files {
    flex-grow: 1;
    background: var(--color-light);
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
          background: var(--color-service-name-hover);
          color: var(--color-light);
          border-bottom: 0;
          &:hover {
            background: var(--color-service-name-hover);
            color: var(--color-light);
          }
        }
        &:last-of-type {
          border-bottom: 0;
        }
        &:hover {
          color: var(--color-service-name-hover);
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
