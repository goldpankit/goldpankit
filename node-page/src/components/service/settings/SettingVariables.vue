<template>
  <div class="tree">
    <div class="variables-wrap">
      <div class="tools">
        <el-button icon="Plus" type="primary">Add</el-button>
      </div>
      <el-tree
        :data="variables"
        draggable
        @node-click="handleNodeClick"
      />
    </div>
    <div class="variable-setting">
      <h4>Variable Setting</h4>
      <div class="content-wrap">
        <el-form v-if="currentNode != null">
          <el-form-item label="Name" required>
            <el-input v-model="currentNode.name" />
          </el-form-item>
          <el-form-item label="Tip" required>
            <I18nInput v-model="currentNode.name" />
          </el-form-item>
          <el-form-item label="Compiler" required>
            <CompilerSelect/>
          </el-form-item>
          <el-form-item label="Input Type" required>
            <InputTypeSelect/>
          </el-form-item>
          <el-form-item label="Remark">
            <el-input v-model="currentNode.name" type="textarea" :rows="3"/>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import CompilerSelect from "../../common/CompilerSelect.vue";
import InputTypeSelect from "../../common/InputTypeSelect.vue";
import I18nInput from "../../common/I18nInput.vue";

export default {
  name: "SettingVariables",
  components: {I18nInput, InputTypeSelect, CompilerSelect},
  props: {
    serviceId: {
      required: true
    }
  },
  data () {
    return {
      currentNode: null,
      variables: [
        {
          label: '路由方式',
          children: [
            { label: 'Hash' },
            { label: 'History' },
          ]
        }
      ]
    }
  },
  methods: {
    // 选择树节点
    handleNodeClick (node) {
      this.currentNode = node
    }
  },
  created () {
  }
}
</script>

<style scoped lang="scss">
.tree {
  height: 100%;
  display: flex;
  .variables-wrap {
    width: 280px;
    flex-shrink: 0;
    border-right: 1px solid var(--border-default-color);
    padding-right: 20px;
    .tools {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 5px;
    }
  }
  // 设置区域
  .variable-setting {
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
