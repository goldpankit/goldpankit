<template>
  <el-dialog
    class="merge-window"
    :title="$t('service.mergeFileTitle')"
    v-model="visible"
    fullscreen
    append-to-body
    :destroy-on-close="true"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <div class="merge-wrap">
      <div class="file-tree">
        <el-tree
          ref="tree"
          :data="files"
          :show-checkbox="true"
          :default-expand-all="true"
          node-key="nodeKey"
          empty-text="No Files"
          :highlight-current="true"
          :expand-on-click-node="false"
          @node-click="selectFile"
          @check="handleCheck"
        >
          <template #default="{ node, data }">
            <span class="node-label" :class="{file: data.type === 'FILE', [data.operaType]: true}">
              <el-icon v-if="data.type === 'DIRECTORY'"><Folder /></el-icon>
              <el-icon v-else><Document /></el-icon>
              <span class="filename">{{data.label}}</span>
            </span>
          </template>
        </el-tree>
      </div>
      <div class="content-preview">
        <template v-if="currentFile != null">
          <!-- 删除文件 -->
          <template v-if="currentFile.operaType === 'DELETED'">
            <DeletedTextFileView
              v-if="currentFile.contentEncode === 'utf-8'"
              :original-text="localContent"
            />
            <DeletedFileView
              v-else
              :file="currentFile"
            />
          </template>
          <!-- 新增文件 -->
          <template v-else-if="currentFile.operaType === 'ADD'">
            <AddTextFileView
              v-if="currentFile.contentEncode === 'utf-8'"
              :filepath="currentFile.filepath"
              :text="currentFile.content"
            />
            <AddFileView v-else :file="currentFile"/>
          </template>
          <!-- 合并文件 -->
          <template v-else>
            <MergeTextFileView
              v-if="currentFile.contentEncode === 'utf-8'"
              :factor="currentFile.nodeKey"
              :filepath="currentFile.filepath"
              :original-text="localContent"
              v-model:new-text="currentFile.content"
            />
            <MergeFileView v-else :file="currentFile"/>
          </template>
        </template>
      </div>
    </div>
    <div class="opera">
      <div class="danger-opera">
        <el-button @click="ignoreAllFiles">{{$t('service.ignoreAll')}}</el-button>
        <el-button type="important2" @click="overwriteAll">{{$t('service.overwriteAll')}}</el-button>
      </div>
      <el-button @click="ignoreFiles">忽略当前文件</el-button>
      <el-button type="primary" @click="overwrite">{{$t('service.overwrite')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {mapState} from 'vuex'
import {merge} from '@/api/service.compile.js'
import path from '@/utils/path'
import MarkdownEditor from "../../../common/MarkdownEditor.vue";
import MergeTextFileView from "./MergeTextFileView.vue";
import DeletedFileView from "./DeletedFileView.vue";
import DeletedTextFileView from "./DeletedTextFileView.vue";
import AddTextFileView from "./AddTextFileView.vue";
import AddFileView from "./AddFileView.vue";
import MergeFileView from "./MergeFileView.vue";
export default {
  name: "MergeWindow",
  components: {
    MergeFileView, AddFileView, AddTextFileView,
    DeletedFileView, DeletedTextFileView, MergeTextFileView,
    MarkdownEditor
  },
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
      if (this.installData == null || this.installData.diff == null) {
        return []
      }
      return this.installData.diff.projectId
    },
    diffFiles () {
      if (this.installData == null || this.installData.diff == null) {
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
    },
    // 当新内容发生变化时，赋值到目标文件中
    newContent() {
      // 从差异文件中找出对应的文件
      const targetFile = this.diffFiles.find(diffFile => {
        // 构建nodekey，跟files中的对象nodeKey构建逻辑保持一致
        let nodeKey = `${diffFile.filepath}-${diffFile.serviceVersionId}`
        return nodeKey === this.currentFile.nodeKey
      })
      if (targetFile != null) {
        targetFile.content = this.currentFile.content
      }
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
      // 点击目录时，重新选中当前文件
      if (data.type === 'DIRECTORY') {
        this.$refs.tree.setCurrentKey(null)
        if (this.currentFile != null) {
          this.$refs.tree.setCurrentKey(`${this.currentFile.filepath}-${this.currentFile.serviceVersionId}`)
        }
        return
      }
      // 点击文件时，选中点击文件
      this.currentFile = data
    },
    // 处理节点选中
    handleCheck (data, {checkedNodes}) {
      this.selectedFiles = checkedNodes.filter(node => node.type !== 'DIRECTORY')
    },
    // 覆盖
    overwrite () {
      let targetFiles = this.selectedFiles
      // 覆盖当前已选文件（单选覆盖）
      if (targetFiles.length === 0 || (targetFiles.length === 1 && targetFiles[0] === this.currentFile)) {
        targetFiles = [this.currentFile]
        merge({
          projectId: this.projectId,
          diffFiles: targetFiles
        })
          .then(() => {
            this.ignoreFiles(this.selectedFiles)
          })
          .catch(e => {
            this.$tip.apiFailed(e)
          })
        return
      }
      // 覆盖当前选择的文件（多选覆盖）
      this.overwriteConfirm(targetFiles)
        .then(() => {
          merge({
            projectId: this.projectId,
            diffFiles: targetFiles
          })
            .then(() => {
              this.ignoreFiles(this.selectedFiles)
            })
            .catch(e => {
              this.$tip.apiFailed(e)
            })
        })
        .catch(() => {})
    },
    // 覆盖所有
    overwriteAll () {
      this.$messageBox.confirm('确认合并所有文件吗？', '重要提示', {
        confirmButtonText: '合并所有',
        cancelButtonText: '取消',
        confirmButtonClass: 'button-danger',
        type: 'warning'
      })
        .then(() => {
          this.overwriteAllConfirm()
            .then(() => {
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
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    // 忽略
    ignoreFiles () {
      let targetFiles = this.selectedFiles
      if (targetFiles.length === 0) {
        targetFiles = [this.currentFile]
      }
      this.installData.diff.diffFiles = this.installData.diff.diffFiles.filter(f => {
        return targetFiles.find(selectedFile => selectedFile.filepath === f.filepath && selectedFile.serviceVersionId === f.serviceVersionId) == null
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
            const filepath = path.join(tempDirPaths)
            targetNode = {
              type: 'DIRECTORY',
              filepath,
              nodeKey: filepath,
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
          nodeKey: `${diffFile.filepath}-${diffFile.serviceVersionId}`,
          operaType: this.__getOperaType(diffFile),
          type: diffFile.filetype,
          label: filename,
          suffix: filename.lastIndexOf('.') === -1 ? '' : filename.substring(filename.lastIndexOf('.') + 1)
        })
        if (this.currentFile == null) {
          // 选中文件
          this.currentFile = children[0]
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(`${children[0].filepath}-${children[0].serviceVersionId}`)
          })
        }
      }
      this.__ns(this.files)
    },
    // 获取操作类型
    __getOperaType (diffFile) {
      if (diffFile.operaType === 'DELETED') {
        return 'DELETED'
      }
      // 没有本地文件，肯定是新增
      if (diffFile.localContent == null) {
        return 'ADD'
      }
      return 'UPDATE'
    },
    // 浓缩目录，将src/main/java这种目录浓缩成一个目录
    __ns (nodes) {
      for (const node of nodes) {
        this.__nsNode(node)
      }
    },
    __nsNode (node) {
      if (node.children && node.children.length === 1 && node.children[0].children != null) {
        let newPath = path.join([node.label, node.children[0].label])
        if (newPath.endsWith('\\')) {
          newPath = newPath.substring(0, newPath.length - 1)
        } else if (newPath.startsWith('/')) {
          newPath = newPath.substring(1)
        }
        node.filepath = newPath
        node.label = newPath
        node.children = node.children[0].children
        this.__nsNode(node)
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
  width: 98% !important;
  height: 98% !important;
  top: 1%;
  .el-dialog__header {
    background: var(--background-color);
    margin-right: 0;
  }
  .el-dialog__body {
    padding: 0;
    flex-grow: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .opera {
    height: 60px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background: var(--background-color);
    .danger-opera {
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }
  .merge-wrap {
    flex-grow: 1;
    display: flex;
    overflow: hidden;
    .file-tree {
      flex-shrink: 0;
      width: 350px;
      overflow-x: auto;
      padding: 10px 0;
      box-sizing: border-box;
      border-right: 5px solid var(--background-color);
      .el-tree {
        .node-label {
          display: flex;
          align-items: center;
          &.file {
            &.ADD {
              color: var(--color-success);
            }
            &.UPDATE {
              color: var(--primary-color-match-2);
            }
          }
          .el-icon {
            font-size: 16px;
            margin-right: 3px;
          }
          &.DELETED {
            text-decoration: line-through;
            color: var(--color-gray);
          }
        }
      }
    }
    // 内容预览
    .content-preview {
      flex-grow: 1;
      overflow: hidden;
      display: flex;
      // 文件变更提醒
      .file-change-tip {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
