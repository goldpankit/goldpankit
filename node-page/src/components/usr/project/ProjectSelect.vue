<template>
  <div class="project-select" :class="{ 'with-block': withBlock }">
    <el-select
      :model-value="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      @change="$emit('change', $event)"
      clearable
    >
      <el-option
        v-for="item in list"
        :value="item.id"
        :key="item.id"
        :label="item.name"
      />
      <template v-if="withPrefix" #prefix>Project:</template>
    </el-select>
    <el-button class="button-icon" type="primary" icon="Plus" @click="$refs.createProjectWindow.open()"></el-button>
    <CreateProjectWindow ref="createProjectWindow" @success="handleCreateSuccess"/>
  </div>
</template>

<script>

import {search} from "../../../api/user.project";
import DirectorySelect from "../../common/DirectorySelect.vue";
import CreateProjectWindow from "./CreateProjectWindow.vue";

export default {
  name: "ProjectSelect",
  components: {CreateProjectWindow, DirectorySelect},
  props: {
    modelValue: {},
    withPrefix: {
      default: true
    },
    withBlock: {
      default: false
    }
  },
  data () {
    return {
      list: []
    }
  },
  methods: {
    fetchList () {
      search()
        .then(data => {
          this.list = data
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 创建完成
    handleCreateSuccess (projectId) {
      this.fetchList()
      this.$emit('change', projectId)
    }
  },
  created () {
    this.fetchList()
  }
}
</script>

<style scoped lang="scss">
.project-select {
  display: flex;
  border: 1px solid var(--border-default-color);
  border-radius: 5px;
  overflow: hidden;
  &.with-block {
    width: 100%;
    :deep(.el-select) {
      flex-grow: 1;
    }
    :deep(.el-button) {
      flex-shrink: 0;
    }
  }
  :deep(.el-select) {
    width: 225px;
    .el-input__wrapper {
      box-shadow: none !important;
    }
    .el-input__prefix-inner {
      color: var(--font-color);
    }
  }
  :deep(.el-button) {
    border: 0;
    border-left: 1px solid var(--border-default-color);
    border-radius: 0;
  }
}
</style>
