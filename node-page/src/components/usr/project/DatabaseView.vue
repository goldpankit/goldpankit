<template>
  <el-descriptions :title="database.name">
    <el-descriptions-item :label="$t('database.databaseType')">{{database.type}}</el-descriptions-item>
    <el-descriptions-item :label="$t('database.host')">
      <div class="content-wrap">
        <template v-if="hidden.host">
          <span class="content-holder">******</span>
          <el-icon @click="hidden.host = false"><View /></el-icon>
        </template>
        <template v-else>
          <span>{{database.host}}</span>
          <el-icon @click="hidden.host = true"><Hide /></el-icon>
        </template>
      </div>
    </el-descriptions-item>
    <el-descriptions-item :label="$t('database.port')">{{database.port}}</el-descriptions-item>
    <el-descriptions-item :label="$t('database.schema')">{{database.schema}}</el-descriptions-item>
    <el-descriptions-item :label="$t('database.username')">
      <div class="content-wrap">
        <template v-if="hidden.username">
          <span class="content-holder">******</span>
          <el-icon @click="hidden.username = false"><View /></el-icon>
        </template>
        <template v-else>
          <span>{{database.username}}</span>
          <el-icon @click="hidden.username = true"><Hide /></el-icon>
        </template>
      </div>
    </el-descriptions-item>
    <el-descriptions-item :label="$t('database.password')">
      <div class="content-wrap">
        <template v-if="hidden.password">
          <span class="content-holder">******</span>
          <el-icon @click="hidden.password = false"><View /></el-icon>
        </template>
        <template v-else>
          <span>{{database.password}}</span>
          <el-icon @click="hidden.password = true"><Hide /></el-icon>
        </template>
      </div>
    </el-descriptions-item>
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
  data () {
    return {
      hidden: {
        host: true,
        username: true,
        password: true
      }
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
  :deep(.content-wrap) {
    display: inline-flex;
    align-items: center;
    .content-holder {
      position: relative;
      top: 3px;
    }
    .el-icon {
      margin-left: 10px;
      &:hover {
        color: var(--primary-color-match-2);
      }
    }
  }
  :deep(.toolbar) {
    display: flex;
    .el-button {
      margin-left: 10px;
    }
  }
}
</style>
