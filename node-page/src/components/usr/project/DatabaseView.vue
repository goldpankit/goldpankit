<template>
  <el-descriptions :title="database.name">
    <el-descriptions-item label="Type">{{database.type}}</el-descriptions-item>
    <el-descriptions-item label="Host">{{database.host}}</el-descriptions-item>
    <el-descriptions-item label="Port">{{database.port}}</el-descriptions-item>
    <el-descriptions-item label="Schema">{{database.schema}}</el-descriptions-item>
    <el-descriptions-item label="Username">{{database.username}}</el-descriptions-item>
    <el-descriptions-item label="Password">******</el-descriptions-item>
    <template #extra>
      <ul class="toolbar">
        <li><el-button size="small" @click="$router.push({ name: 'DatabaseModels', params: { database: database.name } })">Query Models</el-button></li>
        <li><el-button size="small" icon="Edit" @click="$emit('edit')">Edit</el-button></li>
        <li><el-button size="small" type="danger" text @click="$emit('delete')">Delete</el-button></li>
      </ul>
    </template>
  </el-descriptions>
</template>

<script>

export default {
  name: "DatabaseView",
  props: {
    database: {
      required: true
    }
  },
  methods: {
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
