<template>
  <div class="data-source-select" :class="{ 'with-block': withBlock }">
    <el-select
      popper-class="data-source-select-popper"
      :model-value="modelValue"
      append-to-body
      @update:modelValue="handleChange"
      clearable
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
      <template v-if="withPrefix" #prefix>
        <template v-if="prefix == null">{{$t('common.currentDataSource')}}</template>
        <template v-else>{{prefix}}</template>:
      </template>
    </el-select>
    <el-button v-if="withCreateButton" class="button-icon" type="primary" icon="Plus" @click="$refs.operaDataSourceWindow.open()"></el-button>
    <OperaDataSourceWindow ref="operaDataSourceWindow" @success="handleCreateSuccess"/>
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
    ...mapState(['databases'])
  },
  methods: {
    ...mapMutations(['setCurrentDatabase', 'setCurrentDatabaseDetail']),
    ...mapActions(['fetchDatabases']),
    // 切换数据库
    handleChange(databaseId) {
      // 清空选中（手动清空和数据库不存在于本地时均需要清空选中，当服务或插件存在默认的数据库值时，使用者本地没有该数据库，此时需要清空选择）
      const targetDataSource = this.databases.find(item => item.id === databaseId)
      if (databaseId == null || targetDataSource == null) {
        this.setCurrentDatabase(null)
        this.setCurrentDatabaseDetail(null)
        this.$emit('update:modelValue', null)
        this.$emit('change', null)
        return
      }
      // 设置当前选中的数据库信息
      this.setCurrentDatabase(databaseId)
      this.setCurrentDatabaseDetail(targetDataSource)
      this.$emit('update:modelValue', databaseId)
      this.$emit('change', databaseId)
    },
    // 创建完成
    handleCreateSuccess (databaseId) {
      this.fetchDatabases()
        .then(() => {
          this.handleChange(databaseId)
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    }
  },
  created () {
    // 触发一次change，更新选中值
    this.handleChange(this.modelValue)
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
