<template>
  <div class="tree">
    <div class="files-wrap">
      <div class="search-wrap">
        <el-input :placeholder="$t('service.settings.file.filterKeyword')" />
      </div>
      <el-tree
        :data="files"
        :highlight-current="true"
        :empty-text="$t('service.settings.file.noFiles')"
        @node-click="handleNodeClick"
      >
        <template #default="{ node, data }">
          <span class="node-label">
            <el-icon v-if="data.type === 'FILE'"><Document /></el-icon>
            <el-icon v-else-if="data.type === 'DIRECTORY'"><Folder /></el-icon>
            <span class="filename" :class="{ 'flag-file': isFlagFile(data) }">{{data.label}}</span>
          </span>
        </template>
      </el-tree>
    </div>
    <div class="file-setting">
      <h4>{{$t('service.settings.file.fileSetting')}}</h4>
      <div class="content-wrap">
        <el-form v-if="currentNode != null">
          <el-form-item :label="$t('service.settings.file.compiler')">
            <CompilerSelect v-model="currentNode.compiler" @change="saveFileSetting"/>
          </el-form-item>
          <el-form-item label="只有文件在项目中存在时才生效">
            <el-switch
              v-model="currentNode.withoutIfNotExists"
              @change="saveFileSetting"
            />
          </el-form-item>
          <el-form-item :label="$t('service.settings.file.enableExpress')">
            <el-input
              v-model="currentNode.enableExpress"
              type="textarea"
              :rows="8"
              :placeholder="$t('service.settings.file.enableExpressHolder')"
              @input="saveFileSetting"
            />
          </el-form-item>
        </el-form>
        <div v-else class="setting-holder">
          <div class="holder-wrap">
            <h5>{{$t('service.settings.file.fileSetting')}}</h5>
            <p>{{$t('service.settings.file.fileSettingHolder')}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CompilerSelect from "@/components/common/CompilerSelect.vue";
import InputTypeSelect from "@/components/common/InputTypeSelect.vue";
import SortableButton from "@/components/common/SortableButton.vue";
import {sortFiles} from "@/utils/file";
import {
  fetchFiles as fetchServiceFiles,
  saveFileSetting as saveServiceFileSetting
} from "@/api/service";
import {
  fetchFiles as fetchPluginFiles,
  saveFileSetting as savePluginFileSetting
} from "@/api/plugin";

export default {
  name: "SettingFiles",
  components: {SortableButton, CompilerSelect, InputTypeSelect},
  props: {
    space: {
      required: true
    },
    service: {
      required: true
    },
    plugin: {
      required: false
    }
  },
  data () {
    return {
      currentNode: null,
      files: []
    }
  },
  computed: {
    isPlugin () {
      return this.plugin != null
    },
    unique () {
      if (this.isPlugin) {
        return {
          space: this.space,
          service: this.service,
          plugin: this.plugin
        }
      }
      return {
        space: this.space,
        service: this.service
      }
    },
    fetchFilesApi () {
      if (this.isPlugin) {
        return fetchPluginFiles
      }
      return fetchServiceFiles
    },
    saveFileSettingApi () {
      if (this.isPlugin) {
        return savePluginFileSetting
      }
      return saveServiceFileSetting
    }
  },
  methods: {
    // 获取文件
    fetchFiles () {
      this.fetchFilesApi(this.unique)
        .then(data => {
          this.files = data.map(file => {
            file.withoutIfNotExists = file.withoutIfNotExists == null ? false : file.withoutIfNotExists
            return file
          })
          sortFiles(this.files)
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 保存文件配置
    saveFileSetting () {
      if (this.saveTimeout != null) {
        clearTimeout(this.saveTimeout)
      }
      this.saveTimeout = setTimeout(() => {
        this.saveFileSettingApi({
          ...this.unique,
          type: this.currentNode.type,
          path: this.currentNode.path,
          relativePath: this.currentNode.relativePath,
          compiler: this.currentNode.compiler,
          withoutIfNotExists: this.currentNode.withoutIfNotExists,
          enableExpress: this.currentNode.enableExpress,
          variables: this.currentNode.variables.filter(v => v.name.trim().length > 0)
        })
          .then(() => {
          })
          .catch(e => {
            this.$tip.apiFailed(e)
          })
      }, 300)
    },
    // 创建变量
    createVariable () {
      this.currentNode.variables.push({
        name: '',
        value: '',
        compiler: 'static',
        remark: ''
      })
    },
    // 删除变量
    deleteVariable (index) {
      this.currentNode.variables.splice(index, 1)
    },
    // 选择树节点
    handleNodeClick (node) {
      this.currentNode = node
    },
    // 是否为重点标记文件
    isFlagFile (node) {
      return (node.compiler != null && node.compiler !== '') ||
          (node.withoutIfNotExists != null && node.withoutIfNotExists !== false) ||
          (node.enableExpress != null && node.enableExpress !== '') ||
          this.__hasFlagFile(node.children)
    },
    __hasFlagFile (children) {
      if (children == null || children.length === 0) {
        return false
      }
      for (const node of children) {
        const isFlagNode = this.isFlagFile(node)
        if (isFlagNode) {
          return true
        }
      }
      return false
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
    flex-shrink: 0;
    border-right: 1px solid var(--border-default-color);
    padding: 10px 15px 0 15px;
    overflow: auto;
    .search-wrap {
      margin-bottom: 10px;
      :deep(.el-input) .el-input__wrapper{
        border-radius: 30px;
      }
    }
    // 节点
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
        word-break: break-all;
        &.flag-file {
          color: var(--primary-color-match-2);
        }
      }
    }
  }
  // 设置区域
  .file-setting {
    flex-grow: 1;
    background: var(--color-light);
    padding: 0 0 20px 20px;
    overflow: hidden;
    h4 {
      margin-top: 15px;
    }
    .content-wrap {
      padding: 20px 0;
      .el-form {
        :deep(.item-variables) {
          .el-form-item__label {
            padding-right: 0;
            height: 35px;
            margin-bottom: 10px;
            & > div {
              width: 100%;
              display: flex;
              justify-content: space-between;
            }
          }
        }
      }
      .setting-holder {
        width: 100%;
        height: 100%;
        font-size: var(--font-size-middle);
        display: flex;
        justify-content: center;
        padding-top: 100px;
        .holder-wrap {
          width: 500px;
          margin: 0 auto;
          text-align: center;
          line-height: 30px;
          h5 {
            font-size: var(--font-size-large);
            margin-bottom: 20px;
          }
          p {
            color: var(--color-gray);
          }
        }
      }
    }
  }
}
</style>
