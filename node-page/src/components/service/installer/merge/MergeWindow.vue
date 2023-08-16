<template>
  <el-dialog
    custom-class="merge-window"
    title="文件差异处理"
    v-model="visible"
    width="1000px"
    append-to-body
  >
    <div class="merge-wrap">
      <div class="file-tree">
        <el-tree
          :data="files"
          :show-checkbox="true"
          :default-expand-all="true"
          node-key="filepath"
          empty-text="No Files"
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
        <div class="local-content">{{currentFile.content}}</div>
        <div class="new-content">最新内容</div>
      </div>
    </div>
    <div class="opera">
      <el-button>忽略</el-button>
      <el-button type="primary">覆盖</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {mapState} from 'vuex'
import path from '@/utils/path'
export default {
  name: "MergeWindow",
  data () {
    return {
      visible: false,
      currentFile: null,
      selectedFiles: [],
      files: [
        {
          label: 'src/main/java',
          type: 'DIRECTORY',
          children: [
            { label: 'Application.java', type: 'FILE' }
          ]
        },
      ]
    }
  },
  computed: {
    ...mapState(['installData']),
    diffFiles () {
      if (this.installData == null) {
        return []
      }
      return this.installData.diffFiles
    },
  },
  watch: {
    diffFiles () {
      this.__handleDiffFiles()
    }
  },
  methods: {
    // 选择文件
    selectFile (data, node) {
      this.currentFile = data
    },
    // 处理节点选中
    handleCheck (data, {checkedNodes}) {
      this.selectedFiles = checkedNodes.filter(node => node.type !== 'DIRECTORY')
      console.log(this.selectedFiles)
    },
    __handleDiffFiles () {
      this.visible = false
      if (this.diffFiles.length > 0) {
        this.visible = true
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
            label: filename
          })
        }
      }
    }
  }
}
</script>

<style lang="scss">
.merge-window {
  height: 80%;
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
      width: 220px;
      overflow-x: auto;
      background: var(--background-color);
      .el-tree {
        background: var(--background-color);
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
      }
    }
  }
}
</style>
