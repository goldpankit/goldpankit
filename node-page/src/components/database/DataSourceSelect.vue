<template>
  <div class="data-source-select" :class="{ 'with-block': withBlock }">
    <el-select
      popper-class="data-source-select-popper"
      :model-value="modelValue"
      :loading="globalLoading.databases"
      append-to-body
      @update:modelValue="handleChange"
      clearable
      placeholder="请选择或新建数据库"
    >
      <el-option
        v-for="item in databases"
        :value="item.id"
        :key="item.id"
        :label="item.name"
      >
        <div class="option-wrap">
          <p class="name">
            {{item.name}}
          </p>
          <p class="url">
            {{item.host}}:{{item.port}}/{{item.schema}}
          </p>
        </div>
      </el-option>
      <template #label="{ label }">
        <el-icon v-if="globalLoading.databases" class="is-loading"><Loading/></el-icon>
        <span v-else>{{ label }}</span>
      </template>
      <template v-if="withPrefix" #prefix>
        <template v-if="prefix == null">当前数据库</template>
        <template v-else>{{prefix}}</template>:
      </template>
    </el-select>
    <el-button v-if="withCreateButton" class="button-icon" type="primary" icon="Plus" @click="openCreateDatabaseWindow"></el-button>
    <OperaDataSourceWindow ref="operaDataSourceWindow"/>
  </div>
</template>

<script>
import {mapActions, mapMutations, mapState} from 'vuex'
import OperaDataSourceWindow from './OperaDataSourceWindow'

export default {
  name: 'DataSourceSelect',
  components: { OperaDataSourceWindow },
  props: {
    modelValue: {},
    withPrefix: {
      default: true
    },
    prefix: {
      default: null
    },
    withCreateButton: {
      default: true
    },
    withBlock: {
      default: false
    }
  },
  computed: {
    ...mapState(['currentProject', 'globalLoading', 'databases'])
  },
  watch: {
    // 当数据库加载完成时，触发一次数据库选择，防止选中了不是当前项目的数据库，此处一定要监听第一次变化，防止刷新时不能初始化选中数据库
    'globalLoading.databases': {
      immediate: true,
      handler (newValue) {
        if (!newValue) {
          this.handleChange(this.modelValue)
        }
      }
    }
  },
  methods: {
    ...mapMutations(['setCurrentDatabase']),
    ...mapActions(['fetchDatabases']),
    // 打开创建数据库窗口
    openCreateDatabaseWindow () {
      if (this.currentProject == null || this.currentProject === '') {
        this.$tip.warning('请先选择项目！')
        return
      }
      this.$refs.operaDataSourceWindow.open(this.currentProject)
    },
    // 切换数据库
    handleChange(databaseId) {
      // 清空选中（手动清空和数据库不存在于本地时均需要清空选中，当服务或插件存在默认的数据库值时，使用者本地没有该数据库，此时需要清空选择）
      const targetDataSource = this.databases.find(item => item.id === databaseId)
      if (databaseId == null || targetDataSource == null) {
        this.setCurrentDatabase(null)
        this.$emit('update:modelValue', null)
        this.$emit('change', null)
        return
      }
      // 设置当前选中的数据库信息
      this.setCurrentDatabase(databaseId)
      this.$emit('update:modelValue', databaseId)
      this.$emit('change', databaseId)
    }
  }
}
</script>

<style lang="scss">
.data-source-select-popper {
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
      .url {
        font-size: var(--font-size-mini);
        color: var(--color-gray);
      }
    }
  }
}
</style>
<style scoped lang="scss">
.data-source-select {
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
      .el-select__selected-item {
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
