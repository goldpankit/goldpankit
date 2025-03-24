<template>
  <div class="project-select" :class="{ 'with-block': withBlock }">
    <el-select
      popper-class="project-select-popper"
      :model-value="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      @change="handleChange"
      clearable
      filterable
      :filter-method="filterMethod"
      placeholder="请选择或新建项目"
    >
      <el-option
        v-for="item in filterList"
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
import { mapMutations } from 'vuex'
import DirectorySelect from '@/components/common/DirectorySelect'
import OperaProjectWindow from './OperaProjectWindow'
import { getLimitString } from '@/utils/util'
import { fetchAll } from '@/api/project'

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
      keyword: '',
      list: []
    }
  },
  computed: {
    // 过滤后的项目列表
    filterList () {
      if (this.keyword == null || this.keyword.trim() === '') {
        return this.list
      }
      return this.list.filter(item => {
        return item.name.toLowerCase().includes(this.keyword.toLowerCase())
      })
    }
  },
  methods: {
    ...mapMutations(['setCurrentProject', 'setCurrentProjectDetail']),
    getLimitString,
    // 搜索选民
    filterMethod (keyword) {
      this.keyword = keyword
    },
    // 查询项目
    fetchAll (callback) {
      fetchAll()
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
      this.fetchAll(() => {
        // 选中最新创建的项目
        this.handleChange(projectId)
      })
    }
  },
  created () {
    this.fetchAll()
  }
}
</script>

<style lang="scss">
.project-select-popper {
  padding: 5px 0;
  border-radius: 20px !important;
  .el-select-dropdown__wrap {
    max-height: 600px;
  }
  .el-select-dropdown__item {
    height: auto;
    line-height: 1.5;
    padding: 8px 10px;
    border-radius: 10px;
    margin: 0 20px;
    &.is-selected {
      padding: 15px 20px;
      background-color: var(--primary-color-match-1-light) !important;
      .option-wrap {
        .name {
          color: var(--primary-color-match-2) !important;
          font-weight: bold;
        }
        .codespace {
          font-weight: normal;
        }
      }
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
    .el-select__wrapper {
      height: 40px;
      border-radius: 5px 0 0 5px;
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
