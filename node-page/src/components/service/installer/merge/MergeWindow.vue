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
    <SplitWindow
      class="merge-wrap"
      direction="horizontal"
      :sizes="[treeWidthPercent, 100 - treeWidthPercent]"
      :min-size="[50, 500]"
      @onDrag="handleSplitDrag"
    >
      <SplitPanel class="file-tree">
        <div class="toolbar" :style="treeStyle">
          <el-input v-model="filterSetting.keyword" placeholder="搜索文件" prefix-icon="Search">
            <template #suffix>
              <IconButton
                v-model="filterSetting.keywordIgnoreCase"
                :is-switch="true"
                value="iconfont icon-fontsize"
              />
            </template>
          </el-input>
          <el-checkbox v-model="filterSetting.visibleMergeFile" class="visible-merge-file" label="冲突文件"/>
          <el-checkbox v-model="filterSetting.visibleNewFile" class="visible-new-file" label="新增文件"/>
          <el-checkbox v-model="filterSetting.visibleDeleteFile" class="visible-delete-file" label="已删除文件"/>
        </div>
        <el-tree
          ref="tree"
          :style="treeStyle"
          :data="files"
          :show-checkbox="true"
          :default-expand-all="true"
          node-key="nodeKey"
          empty-text="No Files"
          :highlight-current="true"
          :expand-on-click-node="false"
          :filter-node-method="filterFile"
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
      </SplitPanel>
      <SplitPanel class="content-preview">
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
              ref="previewWindow"
              v-if="currentFile.contentEncode === 'utf-8'"
              :factor="currentFile.nodeKey"
              :filepath="currentFile.filepath"
              :original-text="localContent"
              v-model:new-text="currentFile.content"
            />
            <MergeFileView v-else :file="currentFile"/>
          </template>
        </template>
      </SplitPanel>
    </SplitWindow>
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
import MarkdownEditor from '@/components/common/MarkdownEditor'
import MergeTextFileView from './MergeTextFileView'
import DeletedFileView from './DeletedFileView'
import DeletedTextFileView from './DeletedTextFileView'
import AddTextFileView from './AddTextFileView'
import AddFileView from './AddFileView'
import MergeFileView from './MergeFileView'
import MergeWindowMixin from '@/components/service/installer/merge/MergeWindow.mixin'
export default {
  name: "MergeWindow",
  mixins: [MergeWindowMixin],
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
      files: [],
      // 筛选设置
      filterSetting: {
        keyword: '',
        keywordIgnoreCase: true,
        // 显示冲突文件
        visibleMergeFile: true,
        // 显示新增文件
        visibleNewFile: true,
        // 显示已删除文件
        visibleDeleteFile: true
      }
    }
  },
  computed: {
    ...mapState(['installData']),
    // 文件筛选因子
    filterSettingFactors () {
      return JSON.stringify(this.filterSetting)
    },
    // 项目ID
    projectId () {
      if (this.installData == null || this.installData.diff == null) {
        return []
      }
      return this.installData.diff.projectId
    },
    // 所有的差异文件
    diffFiles () {
      if (this.installData == null || this.installData.diff == null) {
        return []
      }
      return this.installData.diff.diffFiles
    },
    // 当前文件本地内容
    localContent () {
      if (this.currentFile == null) {
        return ''
      }
      return this.currentFile.localContent
    },
    // 当前文件新内容
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
    filterSettingFactors () {
      this.$refs.tree.filter(this.filterSetting)
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
      // 清理搜索关键字
      this.filterSetting.keyword = ''
      this.filterSetting.keywordIgnoreCase = true
    },
    // 过滤文件
    filterFile (setting, data) {
      return this.__visibleNode(data)
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
      this.selectedFiles = checkedNodes
        .filter(node => node.type !== 'DIRECTORY')
        // 根据展示设置过滤掉不展示的文件
        .filter(node => {
          return this.__visibleNode(node)
        })
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
    // 判断节点是否展示
    __visibleNode (node) {
      // 目录
      if (node.type === 'DIRECTORY') {
        return false
      }
      // 未知文件
      if (node.operaType !== 'ADD' && node.operaType !== 'UPDATE' && node.operaType !== 'DELETED') {
        return true
      }
      // 关键字匹配
      if (this.filterSetting.keyword.trim() !== '') {
        // 忽略大小写
        if (this.filterSetting.keywordIgnoreCase) {
          if (node.filepath.toLowerCase().indexOf(this.filterSetting.keyword.trim().toLowerCase()) === -1) {
            return false
          }
        }
        // 不忽略大小写
        else if (node.filepath.indexOf(this.filterSetting.keyword.trim()) === -1) {
          return false
        }
      }
      // 展示了新增文件
      if (this.filterSetting.visibleNewFile && node.operaType === 'ADD') {
        return true
      }
      // 展示了冲突文件
      if (this.filterSetting.visibleMergeFile && node.operaType === 'UPDATE') {
        return true
      }
      // 展示了已删除文件
      if (this.filterSetting.visibleDeleteFile && node.operaType === 'DELETED') {
        return true
      }
      return false
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
      if (diffFile.operaType === 'ADD') {
        return 'ADD'
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
.el-dialog.merge-window {
  border-radius: 10px;
  overflow: hidden;
  min-width: 1000px;
  display: flex;
  flex-direction: column;
  width: 98%;
  height: 98% !important;
  top: 1%;
  .el-dialog__header {
    background: var(--tool-toolbar-background-color);
    margin-right: 0;
    padding: 5px 16px;
    text-align: center;
    .el-dialog__title {
      font-size: var(--font-size);
    }
  }
  .el-dialog__body {
    padding: 0 !important;
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
    overflow: hidden;
    // 文件树
    .file-tree {
      overflow-x: hidden;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 10px;
      * {
        user-select: none;
      }
      // 工具栏
      .toolbar {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 5px 10px;
        border-bottom: 1px solid var(--border-default-color);
        // 搜索框
        .el-input {
          width: 180px;
          height: 30px;
          .el-input__wrapper {
            border-radius: 50px;
            background-color: var(--tool-toolbar-background-color);
          }
        }
        .el-checkbox {
          margin-right: 0;
        }
        // 显示冲突文件
        .visible-merge-file {
          .el-checkbox__label {
            color: var(--primary-color-match-2);
          }
        }
        // 显示新增文件
        .visible-new-file {
          .el-checkbox__label {
            color: var(--color-success);
          }
        }
        // 显示删除文件
        .visible-delete-file {
          .el-checkbox__label {
            color: var(--color-gray);
          }
        }
      }
      .el-tree {
        width: 100%;
        height: 100%;
        box-sizing: content-box;
        .el-tree-node {
          // 选中状态
          &.is-current .el-tree-node__content {
            background-color: var(--color-gray-2);
          }
        }
        .node-label {
          display: flex;
          align-items: center;
          // 增加右侧间距，让滚动条滚动到最右侧时留有间距
          padding-right: 10px;
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
      width: 100%;
      height: 100%;
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
