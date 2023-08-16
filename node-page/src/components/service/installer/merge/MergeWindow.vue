<template>
  <el-dialog
    custom-class="merge-window"
    title="文件差异处理"
    v-model="visible"
    fullscreen
    append-to-body
    :show-close="false"
  >
    <div class="merge-wrap">
      <div class="file-tree">
        <el-tree
          ref="tree"
          :data="files"
          :show-checkbox="true"
          :default-expand-all="true"
          node-key="filepath"
          empty-text="No Files"
          :highlight-current="true"
          :check-on-click-node="true"
          @node-click="selectFile"
          @check="handleCheck"
        >
          <template #default="{ node, data }">
        <span class="node-label">
          <el-icon v-if="data.type === 'FILE'"><Document /></el-icon>
          <el-icon v-else-if="data.type === 'DIRECTORY'"><Folder /></el-icon>
          <span class="filename">{{data.label}}</span>
        </span>
          </template>
        </el-tree>
      </div>
      <div v-if="currentFile != null" class="content-preview">
        <div class="local-content">
          <textarea :value="localContent" readonly/>
        </div>
        <div class="new-content">
          <textarea :value="newContent" readonly/>
        </div>
      </div>
    </div>
    <div class="opera">
      <el-button @click="ignoreAllFiles">忽略所有</el-button>
      <el-button type="primary" @click="overwriteAll">覆盖所有</el-button>
      <el-button @click="ignoreFiles" :disabled="selectedFiles.length === 0">忽略</el-button>
      <el-button type="primary" :disabled="selectedFiles.length === 0" @click="overwrite">覆盖</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {mapState} from 'vuex'
import {merge} from '@/api/service.compile.js'
import path from '@/utils/path'
import MarkdownEditor from "../../../common/MarkdownEditor.vue";
export default {
  name: "MergeWindow",
  components: {MarkdownEditor},
  data () {
    return {
      visible: false,
      currentFile: null,
      selectedFiles: [],
      files: []
    }
  },
  computed: {
    ...mapState(['installData']),
    projectId () {
      if (this.installData == null) {
        return []
      }
      return this.installData.diff.projectId
    },
    diffFiles () {
      if (this.installData == null) {
        return []
      }
      return this.installData.diff.diffFiles
    },
    localContent () {
      if (this.currentFile == null) {
        return ''
      }
      return this.currentFile.localContent
    },
    newContent () {
      if (this.currentFile == null) {
        return ''
      }
      return this.currentFile.content
    }
  },
  watch: {
    diffFiles () {
      this.__handleDiffChange()
    }
  },
  methods: {
    open () {
      this.currentFile = null
      this.selectedFiles = []
      this.visible = true
    },
    // 选择文件
    selectFile (data) {
      if (data.type === 'DIRECTORY') {
        return
      }
      this.currentFile = data
    },
    // 处理节点选中
    handleCheck (data, {checkedNodes}) {
      this.selectedFiles = checkedNodes.filter(node => node.type !== 'DIRECTORY')
    },
    // 覆盖
    overwrite () {
      if (this.selectedFiles.length === 0) {
        return
      }
      merge({
        projectId: this.projectId,
        diffFiles: this.selectedFiles
      })
        .then(() => {
          this.ignoreFiles(this.selectedFiles)
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 覆盖所有
    overwriteAll () {
      merge({
        projectId: this.projectId,
        diffFiles: this.diffFiles
      })
        .then(() => {
          this.ignoreAllFiles()
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 忽略
    ignoreFiles () {
      this.installData.diff.diffFiles = this.installData.diff.diffFiles.filter(f => {
        return this.selectedFiles.find(selectedFile => selectedFile.filepath === f.filepath) == null
      })
      this.__handleDiffChange()
      this.selectedFiles = []
    },
    // 忽略所有
    ignoreAllFiles () {
      this.installData.diff.diffFiles = []
      this.visible = false
    },
    // 差异文件变动
    __handleDiffChange () {
      this.visible = false
      if (this.diffFiles.length === 0) {
        return
      }
      this.open()
      this.files = []
      for (const diffFile of this.diffFiles) {
        const paths = path.split(diffFile.filepath)
        const filename = paths.pop()
        const dirpaths = paths
        const tempDirPaths = []
        let children = this.files
        // 填充目录路径
        for (const dir of dirpaths) {
          tempDirPaths.push(dir)
          let targetNode = children.find(f => f.label === dir)
          if (targetNode == null) {
            targetNode = {
              type: 'DIRECTORY',
              filepath: path.join(tempDirPaths),
              label: dir,
              children: []
            }
            children.push(targetNode)
          }
          children = targetNode.children
        }
        // 添加文件
        children.push({
          ...diffFile,
          type: diffFile.filetype,
          label: filename,
          suffix: filename.lastIndexOf('.') === -1 ? '' : filename.substring(filename.lastIndexOf('.') + 1)
        })
        if (this.currentFile == null) {
          // 选中文件
          this.currentFile = children[0]
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(children[0].filepath)
          })
        }
        this.__ns(this.files)
      }
    },
    // 浓缩目录
    __ns (nodes, parentNode) {
      if (nodes == null) {
        return
      }
      if (parentNode != null) {
        if (nodes.length === 1 && nodes[0].children != null) {
          parentNode.label = path.join([parentNode.label, nodes[0].label])
          if (parentNode.label.endsWith('\\')) {
            parentNode.label = parentNode.label.substring(0, parentNode.label.length - 1)
          }
          parentNode.children = nodes[0].children
          this.__ns(parentNode.children, parentNode)
        }
        return
      }
      for (const node of nodes) {
        if (node.children && node.children.length === 1 && node.children[0].children != null) {
          node.label = path.join([node.label, node.children[0].label])
          if (node.label.endsWith('\\')) {
            node.label = node.label.substring(0, node.label.length - 1)
          }
          node.children = node.children[0].children
          this.__ns(node.children, node)
        }
      }
    }
  }
}
</script>

<style lang="scss">
.merge-window {
  min-width: 1000px;
  display: flex;
  flex-direction: column;
  .el-dialog__body {
    padding: 0;
    flex-grow: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .opera {
    height: 50px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .merge-wrap {
    flex-grow: 1;
    display: flex;
    overflow: hidden;
    .file-tree {
      flex-shrink: 0;
      width: 350px;
      overflow-x: auto;
      background: var(--background-color);
      padding: 10px;
      box-sizing: border-box;
      .el-tree {
        background: var(--background-color);
        .node-label {
          display: flex;
          align-items: center;
          .el-icon {
            font-size: 16px;
            margin-right: 3px;
          }
        }
        // 节点
        /*.el-tree-node {*/
        /*  min-height: 30px;*/
        /*  .el-tree-node__content {*/
        /*    min-height: 30px;*/
        /*  }*/
        /*  &.is-current > .el-tree-node__content {*/
        /*    background: var(--selected-background-color);*/
        /*    &:hover {*/
        /*      background: var(--selected-background-color);*/
        /*    }*/
        /*  }*/
        /*}*/
      }
    }
    .content-preview {
      flex-grow: 1;
      overflow: hidden;
      display: flex;
      & > div {
        width: 50%;
        flex-shrink: 0;
        padding: 10px;
        box-sizing: border-box;
        &:last-of-type {
          border-left: 2px solid #eee;
        }
        textarea {
          width: 100%;
          height: 100%;
          resize: none;
          border: 1px solid #eee;
          outline: none !important;
          padding: 10px;
          box-sizing: border-box;
        }
      }
    }
  }
}
</style>
