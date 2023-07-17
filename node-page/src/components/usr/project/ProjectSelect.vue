<template>
  <div class="project-select">
    <el-select :model-value="modelValue" @change="$emit('change', $event)" clearable>
      <el-option
        v-for="item in list"
        :value="item.id"
        :key="item.id"
        :label="item.name"
      />
      <template #prefix>Project:</template>
    </el-select>
  </div>
</template>

<script>

import {search} from "../../../api/user.project";

export default {
  name: "ProjectSelect",
  props: {
    modelValue: {}
  },
  data () {
    return {
      list: [],
      pagination: {
        pageIndex: 1,
        capacity: 1000,
        total: 0
      }
    }
  },
  methods: {
    fetchList () {
      search()
        .then(data => {
          this.list = data
        })
        .catch(e => {
          console.log('e', e)
        })
    },
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
  :deep(.el-select) {
    min-width: 150px;
    max-width: 175px;
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
