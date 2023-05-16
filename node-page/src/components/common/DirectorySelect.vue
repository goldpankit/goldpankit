<template>
  <div class="directory-select">
    <div class="header">
      <h4>{{ title }}</h4>
      <div class="opera">
        <el-button type="primary" icon="Plus">New Folder</el-button>
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
          v-for="file in files"
          :key="file.path"
          :class="{ 'is-file': !file.isDirectory }"
          @click="fetchSubFiles(file)"
        >
          <el-icon>
            <Folder v-if="file.isDirectory"/>
            <Document v-else/>
          </el-icon>
          <p>{{ file.path }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {fetchFiles, fetchRuntimeRoot} from "../../api/local.file";

export default {
  name: "DirectorySelect",
  props: {
    title: {
      default: 'Select Folder'
    }
  },
  data () {
    return {
      paths: [],
      files: []
    }
  },
  methods: {
    // 修改路径
    changePath (index) {
      if (index === this.paths.length - 1) {
        return
      }
      this.paths = this.paths.splice(0, index + 1)
      this.__fetchFiles()
    },
    // 查看子目录
    fetchSubFiles (file) {
      if (!file.isDirectory) {
        return
      }
      this.paths.push(file.path)
      this.__fetchFiles()
    },
    // 获取文件列表
    __fetchFiles () {
      fetchFiles(`/${this.paths.join('/')}/`)
        .then(data => {
          this.files = data.sort((item1, item2) => {
            if (item1.isDirectory) {
              return -1
            }
            return 1
          })
        })
        .catch(e => {
          console.log('e', e)
        })
    },
    // 获取路径
    __fetchDefaultPaths () {
      fetchRuntimeRoot()
        .then(data => {
          this.paths = data.split('/').filter(item => item !== '')
          this.__fetchFiles()
        })
        .catch(e => {
          console.log('e', e)
        })
    }
  },
  created () {
    this.__fetchDefaultPaths()
  }
}
</script>

<style scoped lang="scss">
.directory-select {
  text-align: initial;
  width: 100%;
  //background: var(--background-color);
  padding: 20px;
  display: flex;
  flex-direction: column;
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
          color: var(--color-gray);
          cursor: default;
          &:hover {
            color: var(--color-gray);
          }
        }
        &:last-of-type {
          border-bottom: 0;
        }
        .el-icon {
          margin-right: 10px;
        }
        &:hover {
          color: var(--primary-color-match-2);
        }
      }
    }
  }
}
</style>
