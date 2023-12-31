<template>
  <div class="data-source-select" :class="{ 'with-block': withBlock }">
    <el-select
      popper-class="data-source-select-popper"
      :model-value="modelValue"
      @update:modelValue="handleChange"
      clearable
    >
      <el-option
        v-for="item in dataSources"
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
import {search} from "../../api/database";
import OperaDataSourceWindow from "./OperaDataSourceWindow.vue";
import {mapMutations} from "vuex";

export default {
  name: "DataSourceSelect",
  components: {OperaDataSourceWindow},
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
  data () {
    return {
      dataSources: []
    }
  },
  methods: {
    ...mapMutations(['setCurrentDatabase', 'setCurrentDatabaseDetail']),
    fetchList () {
      search ()
        .then(data => {
          this.dataSources = data
          // 触发handleChange，自动全局选中数据库
          const selectedDataSource = this.dataSources.find(db => db.id === this.modelValue)
          if (selectedDataSource == null) {
            this.handleChange(null)
          } else {
            this.handleChange(selectedDataSource.id)
          }
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 切换数据库
    handleChange(databaseId) {
      const targetDataSource = this.dataSources.find(item => item.id === databaseId)
      this.setCurrentDatabase(databaseId)
      this.setCurrentDatabaseDetail(targetDataSource)
      this.$emit('update:modelValue', databaseId)
      this.$emit('change', databaseId)
    },
    // 创建完成
    handleCreateSuccess (databaseId) {
      this.fetchList()
      this.handleChange(databaseId)
    }
  },
  created () {
    this.fetchList()
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
    border-left: 1px solid var(--border-default-color);
    border-radius: 0;
  }
}
</style>
