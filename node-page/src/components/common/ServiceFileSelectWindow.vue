<template>
  <el-dialog
    v-model="visible"
    :show-close="false"
    custom-class="service-file-select-window"
    append-to-body
  >
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">{{title}}</h4>
      <el-button class="button-icon" icon="Refresh" @click="__fetchFiles"></el-button>
    </template>
    <ul class="paths">
      <li
        v-for="(path,index) in paths"
        :key="path"
        @click="changePath(index)"
      >{{ path }}</li>
    </ul>
    <div class="files">
      <ul>
        <li
          v-for="file in files"
          :key="file.path"
          :class="{ 'is-file': file.type === 'FILE', selected: selectedFilepath === file.path }"
          @click="openOrSelectFile(file)"
        >
          <el-icon>
            <Folder v-if="file.type === 'DIRECTORY'"/>
            <Document v-else/>
          </el-icon>
          <p>{{ file.path }}</p>
        </li>
      </ul>
    </div>
    <div class="opera">
      <el-button size="large" @click="cancelSelect">Cancel</el-button>
      <el-button type="primary" size="large" :disabled="selectedFilepath == null" @click="confirmSelect">Confirm Select</el-button>
    </div>
  </el-dialog>
</template>

<script>

import {fetchFiles} from "../../api/local.file";
import {sortFiles} from "../../utils/file";

export default {
  name: "ServiceFileSelectWindow",
  props: {
    title: {
      default: 'Select Service File'
    },
    serviceConfig: {
      required: true
    }
  },
  data () {
    return {
      visible: false,
      paths: [],
      files: [],
      selectedFilepath: null
    }
  },
  methods: {
    open () {
      this.visible = true
      this.paths = [this.__getProjectName()]
      this.__fetchFiles()
      this.selectedFilepath = null
    },
    // 确认选中
    confirmSelect () {
      this.visible = false
      let path = `${this.paths.slice(1).join('/')}/${this.selectedFilepath}`
      if (!path.startsWith('/')) {
        path = '/' + path
      }
      this.$emit('change', path)
    },
    // 取消选中
    cancelSelect () {
      this.visible = false
    },
    // 切换路径
    changePath (index) {
      if (index === this.paths.length - 1) {
        return
      }
      this.paths = this.paths.splice(0, index + 1)
      this.__fetchFiles()
      this.selectedFilepath = null
    },
    // 打开目录或选择文件
    openOrSelectFile (file) {
      if (file.type === 'DIRECTORY') {
        this.paths.push(file.path)
        this.__fetchFiles()
        this.selectedFilepath = null
        return
      }
      this.selectedFilepath = file.path
    },
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
    // 获取项目名称
    __getProjectName () {
      return this.serviceConfig.codespace.split('/').pop()
    },
    // 获取全路径
    __getAbsolutePath () {
      let absolutePath = `${this.serviceConfig.codespace}/${this.paths.slice(1).join('/')}`
      if (this.serviceConfig.translator.settings.length > 0) {
        absolutePath = `${this.serviceConfig.codespace}/${this.serviceConfig.translator.output}/${this.paths.slice(1).join('/')}`
      }
      if (absolutePath.endsWith('/')) {
        return absolutePath.substring(0, absolutePath.length - 1)
      }
      return absolutePath
    }
  }
}
</script>

<style lang="scss">
.service-file-select-window {
  .el-dialog__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .el-dialog__body {
    padding: 0 30px;
    & > .opera {
      display: flex;
      justify-content: flex-end;
      padding: 0 30px 30px 0;
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
    height: 245px;
    display: flex;
    flex-direction: column;
    ul {
      overflow-y: auto;
      display: flex;
      flex-wrap: wrap;
      li {
        width: 50%;
        flex-shrink: 0;
        padding: 10px;
        border-bottom: 1px dashed var(--border-default-color);
        cursor: pointer;
        display: flex;
        align-items: center;
        &.is-file {
          cursor: default;
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
        p {
          flex-grow: 1;
          overflow: hidden;
          word-break: break-all;
          line-height: 20px;
        }
      }
    }
  }
}
</style>
