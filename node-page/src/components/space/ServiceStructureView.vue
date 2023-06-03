<template>
  <el-tree
    class="service-structure-tree"
    :data="data"
  >
    <template #default="{ node, data }">
      <span class="node-label">
        <el-icon v-if="data.type === 'FILE'"><Document /></el-icon>
        <el-icon v-else-if="data.type === 'DIRECTORY'"><Folder /></el-icon>
        <span class="filename">{{data.path}}</span>
        <span class="text-info-1 text-mini description">{{data.description}}</span>
        <span class="text-info-1 text-mini publish-time">{{data.publishTime}}</span>
      </span>
    </template>
  </el-tree>
</template>

<script>
export default {
  name: "ServiceStructureView",
  props: {
    nodes: {
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
    data () {
      // 找出目录（按级数倒序）
      const roots = this.nodes
        .filter(item => item.type === 'DIRECTORY')
        .sort((item1, item2) => {
          return item2.path.split('/').length - item1.path.split('/').length
        })
      // 找出文件
      const files = this.nodes.filter(item => item.type === 'FILE')
      // 将文件塞进目录中
      for (const dir of roots) {
        let lastPublishFileTime = null
        for (let i = files.length - 1; i >= 0; i--) {
          if (!files[i].path.startsWith(dir.path)) {
            continue
          }
          if (dir.children == null) {
            dir.children = []
          }
          // 修改目录说明
          let filePublishTime = new Date(files[i].publishTime).getTime()
          if (lastPublishFileTime == null || filePublishTime > lastPublishFileTime) {
            dir.description = files[i].description
            lastPublishFileTime = filePublishTime
          }
          // 修改目录最后发布时间
          dir.publishTime = files[i].publishTime
          // 修改文件路径（添加到目录中后只需要保留文件名称）
          files[i].path = files[i].path.split('/').pop()
          dir.children.push(files[i])
          files.splice(i, 1)
        }
      }
      // 将目录升序
      roots.reverse()
      // 倒序目录，依次寻找父节点并插入到父节点中
      for (let i = roots.length - 1; i >= 0; i--) {
        const dir = roots[i]
        let hasParent = false
        for (let j = i - 1; j >= 0; j--) {
          const parentDir = roots[j]
          if (!dir.path.startsWith(parentDir.path)) {
            continue
          }
          if (parentDir.children == null) {
            parentDir.children = []
          }
          // 修改父目录说明（最新发布的目录说明）
          let dirPublishTime = new Date(dir.publishTime).getTime()
          let parentPublishTime = new Date(parentDir.publishTime).getTime()
          if (dirPublishTime > parentPublishTime) {
            parentDir.description = dir.description
            parentDir.publishTime = dir.publishTime
          }
          // 修改目录路径（添加到目录中后只需要保留目录名称）
          dir.path = dir.path.split('/').pop()
          parentDir.children.push(dir)
          hasParent = true
          break
        }
        if (hasParent) {
          roots.splice(i, 1)
        }
      }
      // 将剩余没有找到目录的文件添加到跟节点
      roots.push.apply(roots, files)
      // 整体排序
      this.sortFiles(roots)
      return roots
    }
  },
  methods: {
    // 排序文件
    sortFiles (files) {
      if (files == null || files.length === 0) {
        return
      }
      files.sort((item1, item2) => {
        if (item1.type === 'DIRECTORY' && item2.type === 'DIRECTORY') {
          if(item1.path.toLowerCase() < item2.path.toLowerCase()) {
            return -1
          }
          return 1
        }
        if (item1.type === 'DIRECTORY') {
          return -1
        }
        if (item2.type === 'DIRECTORY') {
          return 1
        }
        if(item1.path.toLowerCase() < item2.path.toLowerCase()) {
          return -1
        }
        return 1
      })
      for (const file of files) {
        this.sortFiles(file.children)
      }
    },
    // 获取描述
    getDescription (node, nodeChildren) {
      if (node.description != null && node.description !== '') {
        return node.description
      }
      if (node.children == null || node.children.length === 0) {
        return ''
      }
      for (const subNode of node.children) {

      }
    }
  }
}
</script>

<style scoped lang="scss">
.service-structure-tree {
  padding-top: 10px;
  :deep(.node-label) {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-icon {
      margin-right: 5px;
    }
    .filename {
      flex-grow: 1;
      color: #005980;
      word-break: break-all;
    }
    .description {
      flex-shrink: 0;
      width: 200px;
      word-break: break-all;
    }
    .publish-time {
      flex-shrink: 0;
      text-align: right;
    }
  }
}
</style>
