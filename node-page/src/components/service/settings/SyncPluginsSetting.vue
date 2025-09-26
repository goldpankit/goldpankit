<template>
  <el-table :data="syncPlugins">
    <el-table-column label="项目标识符" prop="space">
      <template #default="{ row }">
        <el-input v-model="row.space" placeholder="请输入项目标识符" @change="handleChange"/>
      </template>
    </el-table-column>
    <el-table-column label="框架标识符" prop="service">
      <template #default="{ row }">
        <el-input v-model="row.service" placeholder="请输入框架标识符" @change="handleChange"/>
      </template>
    </el-table-column>
    <el-table-column label="版本号" prop="version">
      <template #default="{ row }">
        <el-input v-model="row.version" placeholder="请输入版本号" @change="handleChange">
          <template #prefix>v</template>
        </el-input>
      </template>
    </el-table-column>
    <el-table-column label="最低兼容的框架版本号" prop="minServiceVersion" @change="handleChange">
      <template #default="{ row }">
        <el-input v-model="row.minServiceVersion" placeholder="请输入版本号">
          <template #prefix>v</template>
        </el-input>
      </template>
    </el-table-column>
    <slot></slot>
  </el-table>
</template>

<script>

export default {
  name: 'SyncPluginsSetting',
  props: {
    syncPlugins: {
      required: true
    }
  },
  computed: {
    // 是否没有可输入的行
    noNewLine () {
      for (const pluginLine of this.syncPlugins) {
        if (pluginLine.space.trim() === ''
          && pluginLine.service.trim() === ''
          && pluginLine.version.trim() === ''
          && pluginLine.minServiceVersion.trim() === '') {
          return false
        }
      }
      return true
    }
  },
  watch: {
    // 如果没有空行，则新增空行
    noNewLine: {
      immediate: true,
      handler () {
        if (this.noNewLine) {
          this.syncPlugins.push({
            space: '',
            service: '',
            version: '',
            minServiceVersion: ''
          })
        }
      }
    }
  },
  methods: {
    handleChange () {
      this.$emit('change')
    }
  }
}
</script>

<style scoped lang="scss">
.el-table {
  :deep(.el-table__cell) {
    padding: 5px 0;
  }
}
</style>
