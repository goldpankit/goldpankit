<template>
  <div class="ai-session-list">
    <div class="session-list__header">
      <h3>会话列表</h3>
    </div>
    <div class="session-list__body"></div>
    <div class="session-list__footer">
      <el-button type="primary" size="large" @click="$emit('open-settings')">参数设置</el-button>
      <el-button type="primary" size="large">新建会话</el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: "SessionList"
}
</script>

<style scoped lang="scss">
.ai-session-list {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .session-list__header {
    flex-shrink: 0;
    height: 25px;
    display: flex;
    padding: 10px;
    box-sizing: content-box;
    & > * {
      height: 100%;
      line-height: 25px;
    }
    & > span {
      width: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #ccc;
    }
  }
  .session-list__body {
    flex-grow: 1;
  }
  .session-list__footer {
    flex-shrink: 0;
    padding: 20px;
    display: flex;
    border-top: 2px solid #eee;
    justify-content: space-between;
    .el-button {
      width: 100%;
      margin-right: 0;
    }
  }
}
</style>
