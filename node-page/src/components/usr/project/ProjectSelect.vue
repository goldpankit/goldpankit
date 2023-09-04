<template>
  <div class="project-select" :class="{ 'with-block': withBlock }">
    <el-select
      :model-value="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      @change="handleChange"
      clearable
    >
      <el-option
        v-for="item in list"
        :value="item.id"
        :key="item.id"
        :label="item.name"
      />
      <template v-if="withPrefix" #prefix>{{$t('common.currentProject')}}:</template>
    </el-select>
    <el-button class="button-icon" type="primary" icon="Plus" @click="$refs.operaProjectWindow.open()"></el-button>
    <OperaProjectWindow ref="operaProjectWindow" @success="handleCreateSuccess"/>
  </div>
</template>

<script>

import {search} from "../../../api/user.project";
import DirectorySelect from "../../common/DirectorySelect.vue";
import OperaProjectWindow from "./OperaProjectWindow.vue";
import {mapMutations, mapState} from "vuex";

export default {
  name: "ProjectSelect",
  components: {OperaProjectWindow, DirectorySelect},
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
    ...mapMutations(['setCurrentProjectDetail']),
    fetchList () {
      search()
        .then(data => {
          this.list = data
          // 清空不存在的项目选择
          if (this.modelValue != null) {
            const targetProject = this.list.find(p => p.id === this.modelValue)
            this.setCurrentProjectDetail(targetProject)
            if (targetProject == null) {
              this.$emit('update:modelValue', null)
              this.$emit('change', null)
              this.handleChange(null)
            }
          }
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 选择项目
    handleChange (projectId) {
      const targetProject = this.list.find(item => item.id === projectId)
      this.setCurrentProjectDetail(targetProject)
      this.$emit('change', projectId)
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
