<template>
  <div class="tree">
    <div class="files-wrap">
      <el-input placeholder="Filter keyword" />
      <el-tree
        :data="files"
        @node-click="handleNodeClick"
      />
    </div>
    <div class="file-setting">
      <h4>File Setting</h4>
      <div class="content-wrap">
        <SettingForm :service-id="serviceId" :target="currentNode"/>
      </div>
    </div>
  </div>
</template>

<script>
import {fetchFiles} from "../../../api/service";
import SettingForm from "./SettingForm.vue";

export default {
  name: "SettingFiles",
  components: {SettingForm},
  props: {
    serviceId: {
      required: true
    }
  },
  data () {
    return {
      currentNode: null,
      files: []
    }
  },
  methods: {
    // 获取文件
    fetchFiles () {
      fetchFiles(this.serviceId)
        .then(data => {
          this.files = data
        })
        .catch(e => {
          console.log('e', e)
        })
    },
    // 选择树节点
    handleNodeClick (node) {
      this.currentNode = node
    }
  },
  created () {
    this.fetchFiles()
  }
}
</script>

<style scoped lang="scss">
.tree {
  height: 100%;
  display: flex;
  // 文件树
  .files-wrap {
    width: 280px;
    border-right: 1px solid var(--border-default-color);
    padding-right: 20px;
    .el-input {
      margin-bottom: 5px;
    }
  }
  // 设置区域
  .file-setting {
    flex-grow: 1;
    background: var(--color-light);
    padding: 0 0 20px 20px;
    overflow: hidden;
    h4 {
      margin-top: 5px;
    }
    .content-wrap {
      padding: 20px 0;
    }
  }
}
</style>
