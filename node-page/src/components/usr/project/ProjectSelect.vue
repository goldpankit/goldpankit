<template>
  <div class="project-select" :class="{ 'with-block': withBlock }">
    <el-select
      popper-class="project-select-popper"
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
      >
        <div class="option-wrap">
          <p class="name">
            {{item.name}}
            <template v-if="item.remark != null && item.remark.trim() !== ''">
              ({{getLimitString(item.remark, 15)}})
            </template>
          </p>
          <p class="codespace">{{item.codespace}}</p>
        </div>
      </el-option>
      <template v-if="withPrefix" #prefix>{{$t('common.currentProject')}}:</template>
    </el-select>
    <el-button class="button-icon" type="primary" icon="Plus" @click="$refs.operaProjectWindow.open()"></el-button>
    <OperaProjectWindow ref="operaProjectWindow" @success="handleCreateSuccess"/>
  </div>
</template>

<script>
import {search} from "@/api/user.project";
import DirectorySelect from "@/components/common/DirectorySelect.vue";
import OperaProjectWindow from "./OperaProjectWindow.vue";
import {mapMutations} from "vuex";
import {getLimitString} from "@/utils/util";

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
    ...mapMutations(['setCurrentProject', 'setCurrentProjectDetail']),
    getLimitString,
    // 查询项目
    fetchList (callback) {
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
          callback && callback()
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 选择项目
    handleChange (projectId) {
      const targetProject = this.list.find(item => item.id === projectId)
      this.setCurrentProject(projectId)
      this.setCurrentProjectDetail(targetProject)
      this.$emit('update:modelValue', projectId)
      this.$emit('change', projectId)
    },
    // 创建完成
    handleCreateSuccess (projectId) {
      this.fetchList(() => {
        this.handleChange(projectId)
      })
    }
  },
  created () {
    this.fetchList()
  }
}
</script>

<style lang="scss">
.project-select-popper {
  .el-select-dropdown__item {
    height: auto;
    line-height: 1.5;
    padding: 8px 20px;
    &.selected {
      background-color: var(--primary-color-match-1-light);
    }
    .option-wrap {
      .name {
        color: var(--color-service-name);
      }
      .codespace {
        font-size: var(--font-size-mini);
        color: var(--color-gray);
      }
    }
  }
}
</style>
<style scoped lang="scss">
.project-select {
  display: flex;
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
      height: 40px;
      border-radius: 5px 0 0 5px;
      .el-input__inner {
        color: var(--color-service-name) !important;
        font-weight: bold;
      }
    }
    .el-input__prefix-inner {
      color: var(--font-color);
    }
  }
  :deep(.el-button) {
    border: 0;
    border-radius: 0;
    width: 40px;
    height: 40px;
  }
}
</style>
