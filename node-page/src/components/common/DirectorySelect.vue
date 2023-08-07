<template>
  <div class="directory-select">
    <div class="header">
      <h4>{{ title == null ? $t('component.selectDirectory') : title }}</h4>
      <div class="opera">
        <el-button class="button-icon" icon="Refresh" @click="__fetchFiles"></el-button>
        <el-button type="primary" icon="Plus" @click="createDirectory">{{$t('component.createNewFolder')}}</el-button>
      </div>
    </div>
    <ul class="paths">
      <li
        v-for="(path,index) in paths"
        :key="path"
        :class="{ current: index === paths.length - 1 }"
        @click="changePath(index)"
      >{{ path }}</li>
    </ul>
    <div class="files">
      <ul>
        <li
          v-for="(file,index) in files"
          :key="file.path"
          :class="{ 'is-file': file.type === 'file' }"
          @click="fetchSubFiles(file)"
        >
          <template v-if="file.__creatable">
            <div class="new-directory">
              <el-input v-model="file.path" placeholder="unknown directory"/>
              <el-button type="primary" class="button-icon" icon="Select" :disabled="file.__working_create" @click="confirmCreateDirectory(file)"></el-button>
              <el-button icon="Close" class="button-icon" @click="cancelCreateDirectory(index)"></el-button>
            </div>
          </template>
          <template v-else>
            <el-icon>
              <Folder v-if="file.type === 'DIRECTORY'"/>
              <Document v-else/>
            </el-icon>
            <p>{{ file.path }}</p>
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {fetchFiles, fetchRuntimeRoot, createDirectory} from "../../api/local.file";
import {sortFiles} from "../../utils/file";

export default {
  name: "DirectorySelect",
  props: {
    modelValue: {},
    title: {
      require: false
    }
  },
  data () {
    return {
      paths: [],
      files: []
    }
  },
  methods: {
    // 添加目录
    createDirectory () {
      this.files.push({
        path: '',
        type: 'DIRECTORY',
        __creatable: true,
        __working_create: false
      })
    },
    // 确认添加
    confirmCreateDirectory (file) {
      if (file.__working_create) {
        return
      }
      file.__working_create = true
      createDirectory(this.__getAbsolutePath(file.path))
        .then(() => {
          file.__creatable = false
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
      this.paths = this.paths.splice(0, index + 1)
      this.__fetchFiles()
      this.$emit('update:modelValue', this.__getAbsolutePath())
      this.$emit('change', this.__getAbsolutePath())
    },
    // 查看子目录
    fetchSubFiles (file) {
      if (file.__creatable) {
        return
      }
      if (file.type === 'file') {
        return
      }
      this.paths.push(file.path)
      this.__fetchFiles()
      this.$emit('update:modelValue', this.__getAbsolutePath())
      this.$emit('change', this.__getAbsolutePath())
    },
    // 获取文件列表
    __fetchFiles () {
      fetchFiles(this.__getAbsolutePath())
        .then(data => {
          this.files = data
          sortFiles(this.files)
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 获取路径
    __fetchDefaultPaths () {
      fetchRuntimeRoot()
        .then(data => {
          this.paths = data.split('/').filter(item => item !== '')
          this.__fetchFiles()
          this.$emit('update:modelValue', this.__getAbsolutePath())
          this.$emit('change', this.__getAbsolutePath())
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 获取绝对路径
    __getAbsolutePath (path) {
      return `/${this.paths.join('/')}${path == null ? '' : '/' + path}`
    }
  },
  created () {
    if (this.modelValue == null || this.modelValue === '') {
      this.__fetchDefaultPaths()
      return
    }
    this.paths = this.modelValue.split('/').filter(item => item !== '')
    this.$emit('update:modelValue', this.__getAbsolutePath())
    this.$emit('change', this.__getAbsolutePath())
    this.__fetchFiles()
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
  .paths {
    flex-shrink: 0;
    display: flex;
    flex-wrap: wrap;
    padding: 10px 0 5px 0;
    border-bottom: 1px solid var(--border-default-color);
    li {
      background: var(--background-color);
      padding: 5px 8px;
      position: relative;
      cursor: pointer;
      margin-right: 15px;
      margin-bottom: 5px;
      border-radius: 5px;
      transition: all ease .15s;
      line-height: 20px;
      &.current {
        font-weight: bold;
        color: var(--primary-color-match-2);
        cursor: default;
      }
      &:hover {
        color: var(--primary-color-match-2);
      }
      &::after {
        content: '/';
        position: absolute;
        right: -11px;
        color: var(--font-color);
      }
      &:last-of-type {
        &::after {
          content: '';
        }
      }
    }
  }
  .files {
    flex-grow: 1;
    background: var(--color-light);
    height: 280px;
    display: flex;
    flex-direction: column;
    ul {
      overflow-y: auto;
      display: flex;
      flex-wrap: wrap;
      li {
        width: 50%;
        padding: 0 10px;
        height: 40px;
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
        &:last-of-type {
          border-bottom: 0;
        }
        &:hover {
          color: var(--primary-color-match-2);
        }
        .el-icon {
          margin-right: 10px;
        }
        // 创建目录
        .new-directory {
          width: 100%;
          display: flex;
          .el-input {
            flex-grow: 1;
          }
          .el-button {
            flex-shrink: 0;
            margin-left: 10px;
          }
        }
      }
    }
  }
}
</style>
