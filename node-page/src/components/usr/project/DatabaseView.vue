<template>
  <el-descriptions :title="database.name">
    <el-descriptions-item :label="$t('database.databaseType')">{{database.type}}</el-descriptions-item>
    <el-descriptions-item :label="$t('database.host')">{{database.host}}</el-descriptions-item>
    <el-descriptions-item :label="$t('database.port')">{{database.port}}</el-descriptions-item>
    <el-descriptions-item :label="$t('database.schema')">{{database.schema}}</el-descriptions-item>
    <el-descriptions-item :label="$t('database.username')">{{database.username}}</el-descriptions-item>
    <el-descriptions-item :label="$t('database.password')">******</el-descriptions-item>
    <template #extra>
      <ul class="toolbar">
        <li><el-button size="small" @click="gotoQueryModels">{{$t('database.queryModels')}}</el-button></li>
        <li><el-button size="small" icon="Edit" @click="$emit('edit')">{{$t('common.edit')}}</el-button></li>
        <li><el-button size="small" type="danger" text @click="$emit('delete')">{{$t('common.delete')}}</el-button></li>
      </ul>
    </template>
  </el-descriptions>
</template>

<script>

import {mapMutations} from "vuex";

export default {
  name: "DatabaseView",
  props: {
    database: {
      required: true
    }
  },
  methods: {
    ...mapMutations(['setCurrentDatabase']),
    // 跳转至查询模型页
    gotoQueryModels () {
      this.setCurrentDatabase(this.database.id)
      this.$router.push({ name: 'DatabaseQueryModel' })
    }
  }
}
</script>

<style scoped lang="scss">
.el-descriptions {
  :deep(.toolbar) {
    display: flex;
    .el-button {
      margin-left: 10px;
    }
  }
}
</style>
