<template>
  <div class="database-select" :class="{ 'with-block': withBlock }">
    <el-select
      :model-value="modelValue"
      @update:modelValue="handleChange"
      clearable
    >
      <el-option
        v-for="item in list"
        :value="item.id"
        :key="item.id"
        :label="item.name"
      />
      <template v-if="withPrefix" #prefix>Data Source:</template>
    </el-select>
    <el-button v-if="withCreateButton" class="button-icon" type="primary" icon="Plus" @click="$refs.createDatabaseWindow.open()"></el-button>
    <CreateDatabaseWindow ref="createDatabaseWindow" @success="handleCreateSuccess"/>
  </div>
</template>

<script>
import {search} from "../../api/database";
import CreateDatabaseWindow from "./CreateDatabaseWindow.vue";
import {mapMutations} from "vuex";

export default {
  name: "DataSourceSelect",
  components: {CreateDatabaseWindow},
  props: {
    modelValue: {},
    withPrefix: {
      default: true
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
      list: []
    }
  },
  methods: {
    ...mapMutations(['setCurrentDatabase']),
    fetchList () {
      search ()
        .then(data => {
          this.list = data
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 切换数据库
    handleChange(databaseId) {
      this.$emit('update:modelValue', databaseId)
      this.$emit('change', databaseId)
      // 全局设定为当前数据库
      this.setCurrentDatabase(databaseId)
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

<style scoped lang="scss">
.database-select {
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
