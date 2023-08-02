<template>
  <div class="tree">
    <div class="files-wrap">
      <div class="search-wrap">
        <el-input placeholder="Filter keyword" />
      </div>
      <el-tree
        :data="files"
        empty-text="No Files"
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
      <h4>File Setting</h4>
      <div class="content-wrap">
        <el-form v-if="currentNode != null">
          <el-form-item label="Compiler">
            <CompilerSelect v-model="currentNode.compiler" :with-follow-service="true" @change="saveFileSetting"/>
          </el-form-item>
          <el-form-item label="Enable Express">
            <el-input v-model="currentNode.enableExpress" type="textarea" :rows="8" @input="saveFileSetting"/>
          </el-form-item>
          <el-form-item label="Variables" class="item-variables">
            <template #label>
              <div>
                <label>Variables</label>
                <div class="opera">
                  <el-button icon="Top" class="button-icon"></el-button>
                  <el-button icon="Bottom" class="button-icon"></el-button>
                  <el-button @click="createVariable">Add</el-button>
                </div>
              </div>
            </template>
            <el-table :data="currentNode.variables" v-sortable:config="{ data: currentNode.variables, onChange: handleSorted }">
              <el-table-column width="25px">
                <SortableButton/>
              </el-table-column>
              <el-table-column label="*Name" min-width="120px">
                <template #default="{ row }">
                  <el-input v-model="row.name" @input="saveFileSetting"/>
                </template>
              </el-table-column>
              <el-table-column label="*Value" min-width="200px">
                <template #default="{ row }">
                  <el-input v-model="row.value" type="textarea" :rows="1" @change="saveFileSetting"/>
                </template>
              </el-table-column>
              <el-table-column label="*Compiler" min-width="120px">
                <template #default="{ row }">
                  <CompilerSelect v-model="row.compiler" @change="saveFileSetting"/>
                </template>
              </el-table-column>
              <el-table-column label="Remark" min-width="140px">
                <template #default="{ row }">
                  <el-input v-model="row.remark" type="textarea" :rows="1" @input="saveFileSetting"/>
                </template>
              </el-table-column>
              <el-table-column v-if="currentNode.variables.length > 0" min-width="60px" fixed="right">
                <template #default="{ row, index }">
                  <el-button icon="Delete" class="button-icon" @click="deleteVariable(index)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import CompilerSelect from "../../common/CompilerSelect.vue";
import InputTypeSelect from "../../common/InputTypeSelect.vue";
import {fetchFiles, saveFileSetting} from "../../../api/service";
import {sortFiles} from "../../../utils/file";
import Sortable from 'sortablejs'
import SortableButton from "../../common/SortableButton.vue";

export default {
  name: "SettingFiles",
  components: {SortableButton, CompilerSelect, InputTypeSelect},
  props: {
    space: {
      required: true
    },
    service: {
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
      fetchFiles(this.space, this.service)
        .then(data => {
          this.files = data
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
        saveFileSetting({
          space: this.space,
          service: this.service,
          type: this.currentNode.type,
          path: this.currentNode.path,
          relativePath: this.currentNode.relativePath,
          compiler: this.currentNode.compiler,
          enableExpress: this.currentNode.enableExpress,
          variables: this.currentNode.variables.filter(v => v.name.trim().length > 0)
        })
          .then(() => {
            console.log('保存成功')
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
        (node.enableExpress != null && node.enableExpress !== '') ||
        (node.variables.length > 0)
    },
    // 排序后
    handleSorted (newVariables) {
      this.currentNode.variables = []
      this.$nextTick(() => {
        this.currentNode.variables = newVariables
        this.saveFileSetting()
      })
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
        color: #005980;
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
    }
  }
}
</style>
